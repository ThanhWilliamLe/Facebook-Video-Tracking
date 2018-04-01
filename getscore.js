//var accessToken = prompt("Input B110 access token.");
$(document).ready(getAccessTokenAndPopulate());
var cards = [];

function getAccessTokenAndPopulate()
{
	$.get("./accesstoken",
		function (userAccessToken)
		{
			$.get({
				url: "https://graph.facebook.com/v2.12/me/accounts?access_token=" + userAccessToken,
				success: function (data)
				{
					data.data.forEach(function (val)
					{
						if (val.name == "B110 Dance Team")
						{
							populateCards(val.access_token);
							return;
						}
					})
				},
				error: function (e)
				{
					var newToken = window.prompt("New user access token?");
					if (newToken.length > 10)
					{
						$.post(
							"./accesstoken.php",
							{"token": newToken},
							function (result)
							{
								console.log(result);
								getAccessTokenAndPopulate();
							});
					}
				}
			});
		});
}

function populateCards(accessToken)
{

	var cardCount = 1;
	var postIds = $("#posts")[0].innerHTML.split(",");
	var cardTemplate = $("#pc-0")[0];
	postIds.forEach(function (id)
	{
		var card = cardTemplate.cloneNode(true);
		card.id += cardCount++;
		card.classList.toggle("none", false);
		cards.push(card);
		populateCardData(accessToken, card, id);
	});
}

function populateCardData(accessToken, card, id)
{
	$.get(
		"https://graph.facebook.com/v2.12/196567220847751_" + id + "?" +
		"fields=" +
		"shares," +
		"reactions.limit(0).summary(true)," +
		"comments.limit(0).summary(true)," +
		"name," +
		"message," +
		"source," +
		"full_picture," +
		"permalink_url" +
		"&access_token=" + accessToken,
		function (data)
		{

			$.get(
				"https://graph.facebook.com/v2.12/196567220847751_" + id + "/insights/" +
				"post_impressions_viral," +
				"post_video_views," +
				"post_negative_feedback," +
				"post_video_avg_time_watched," +
				"post_video_length" +
				"?access_token=" + accessToken,
				function (data2)
				{
					putData(card, data, data2);
					$("#cards")[0].appendChild(card);
					checkCrown();
				}
			);
		}
	);
}

function putData(card, data1, data2)
{
	//console.log(data1);
	//console.log(data2);
	$(card).find(".card-img-top")[0].src = data1["full_picture"];
	$(card).find(".post-link").each(function (i, a)
	{
		a.href = data1["permalink_url"]
	});
	$(card).find(".card-title").html(data1.name.replace($("#posts-name-trim")[0].innerHTML, ""));

	var infoList = $(card).find(".post-info")[0];
	infoList.innerHTML += '<li class="list-group-item post-message">' + data1.message + '</li>';

	var reactions = data1.reactions.summary.total_count;
	var shares = data1.shares.count;
	var comments = data1.comments.summary.total_count;
	var views = data2.data[2].values[0].value;
	var virality = data2.data[0].values[0].value;
	var negative = data2.data[3].values[0].value;
	var view_avg = Math.round(data2.data[4].values[0].value * 100 / data2.data[5].values[0].value);
	var score = reactions + 3 * shares;
	card.setAttribute("score", score);

	addListItem(infoList, "blue", 'Reactions: ' + reactions + ' (+' + reactions + ' score)');
	addListItem(infoList, "blue", 'Shares: ' + shares + ' (+' + shares * 3 + ' score)');
	addListItem(infoList, "hotpink", 'Views: ' + views);
	addListItem(infoList, "hotpink", 'Average view: ' + view_avg + '% video length');
	addListItem(infoList, "green", 'Virality: ' + virality);
	addListItem(infoList, "green", 'Comments: ' + comments);
	addListItem(infoList, "red", 'Negative: ' + negative);
	addListItem(infoList, "gold", '<b>Total score: ' + score + '</b>', true);
}

function addListItem(infoList, color, string, rightAlign)
{
	infoList.innerHTML += '<li ' +
		'class="list-group-item" ' +
		'style="color: ' + color + (rightAlign ? ";text-align:right" : "") + '">' +
		string +
		'</li>';
}

function checkCrown()
{
	var scores = [];
	cards.forEach(function(card){
		scores.push(card.getAttribute("score"));
	});
	var maxScore = Math.max.apply(null,scores);
	cards.forEach(function(card){
		var score = card.getAttribute("score");
		if(score==maxScore) $(card).find(".crown-img").show();
		else $(card).find(".crown-img").hide();
	});
}