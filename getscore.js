//var accessToken = prompt("Input B110 access token.");
$(document).ready(populateCards());

function populateCards()
{
	var cardCount = 1;
	var postIds = $("#posts")[0].innerHTML.split(",");
	var cardTemplate = $("#pc-0")[0];
	postIds.forEach(function (id)
	{
		var card = cardTemplate.cloneNode(true);
		card.id += cardCount++;
		card.classList.toggle("none", false);
		$("#cards")[0].appendChild(card);
		getData(card, id);
	});
}

function getData(card, id)
{
	var accessToken = "EAACEdEose0cBABFSobxU8e8yytE202OZACP6qyJAn91hkASkCTPwbNFDZC8X5XvCHgtS01yWvXMlqecctX9ggAhH5FUOEU3dQ5fJXtVZBBlQwMCYxAWjZAYtoF4tnMkSRZBa3ghJTyDdIVWuQjx8uEdZCEgsPNZCw8UefoGEWyxZA5JFZBKWD5b5zMpZCAJMy2bGMv6wJrmZCS1kAZDZD";
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
			/*
			$.get(
				"https://graph.facebook.com/v2.12/196567220847751_" + id + "/insights/post_impressions_viral?access_token=" + accessToken,
				function (data2)
				{
					putData(card, data, data2);
				}
			);
			*/
			putData(card,data,null);
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
	$(card).find(".card-title").html(data1.name);

	var infoList = $(card).find(".post-info")[0];
	infoList.innerHTML += '<li class="list-group-item post-message">' + data1.message + '</li>';

	infoList.innerHTML += '<li class="list-group-item" style="color: blue">Reactions: ' + data1.reactions.summary.total_count + '</li>';
	infoList.innerHTML += '<li class="list-group-item" style="color: green">Shares: ' + data1.shares.count + '</li>';
	infoList.innerHTML += '<li class="list-group-item" style="color: dimgrey">Comments: ' + data1.comments.summary.total_count + '</li>';
	if(data2!=null) infoList.innerHTML += '<li class="list-group-item" style="color: orangered">Virality: ' + data2.data[0].values[0].value + '</li>';


	var score = data1.reactions.summary.total_count + 3 * data1.shares.count;
	infoList.innerHTML += '<li class="list-group-item" style="color: gold"><b>Total score: ' + score + '</b></li>';
}
