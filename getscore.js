function getData(id)
{
    var accessToken = "EAACEdEose0cBAIZCIQKYEiUshqZAj7WOUMdrERjbky2JTWsmTcEdCSRA8s7Vo6lp1rdrsTmYQReZCZBf686FkWSS31BTMLnZAQSLA0bBotOVvGZCjeH6uev9RIawMxfO0kqHWEIsKFrsAZAEhQGiBQpp1nw34F3ctl23ztDPQExMHpq4IZCuM4w8wP2bILNIRegwBGcNoDBFGwZDZD";
    $.get(
        "https://graph.facebook.com/v2.12/196567220847751_"+id+"?" +
        "fields=" +
            "shares," +
            "likes.limit(0).summary(true)," +
            "comments.limit(0).summary(true)," +
            "name," +
            "message," +
            "source," +
            "full_picture," +
            "permalink_url" +
        "&access_token="+accessToken,
        function(data){console.log(data)}
    );
}