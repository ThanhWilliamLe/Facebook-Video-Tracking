//var accessToken = prompt("Input B110 access token.");
$(document).ready(getAccessTokenAndPopulate());

function getAccessTokenAndPopulate()
{

	var appAccessToken = "EAACEdEose0cBAEyC4PGfdJYU6G822BF5lNZCpvdcNyJMGdmDlxjVUwq08JhdWw7wSZBS0DqTYVlQx4FlHMmVuurNNj1I923wsaYL7uzNqnE0UaCAekyc8lcBAhTeO3PWnvbrpMvPtsTyGYZAZAvqpnj9I47pfY5WagyNrdba0yRF67nwU0fLEJP3oiwzMZAi61gafSDHV2gZDZD";
	$.get("https://graph.facebook.com/v2.12/me/accounts?access_token=" + appAccessToken,
		function (data)
		{
			data.data.forEach(function (val)
			{
				if (val.name == "B110 Dance Team")
				{
					populateCards(val.access_token);
					return;
				}
			})
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
				"post_video_length," +
				"post_video_view_time" +
				"?access_token=" + accessToken,
				function (data2)
				{
					putData(card, data, data2);
					$("#cards")[0].appendChild(card);
				}
			);
		}
	);
}

function putData(card, data1, data2)
{
	console.log(data1);
	console.log(data2);
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
	var score = reactions + 3 * shares;

	infoList.innerHTML += '<li class="list-group-item" style="color: blue">Reactions: ' + reactions + '</li>';
	infoList.innerHTML += '<li class="list-group-item" style="color: green">Shares: ' + shares + '</li>';
	infoList.innerHTML += '<li class="list-group-item" style="color: dimgrey">Comments: ' + comments + '</li>';
	if (data2 != null)
	{
		infoList.innerHTML += '<li class="list-group-item" style="color: hotpink">Views: ' + views + '</li>';
		infoList.innerHTML += '<li class="list-group-item" style="color: teal">Virality: ' + virality + '</li>';
		infoList.innerHTML += '<li class="list-group-item" style="color: red">Negative: ' + negative + '</li>';
	}
	infoList.innerHTML += '<li class="list-group-item" style="color: gold;text-align: right"><b>Total score: ' + score + '</b></li>';
}
