# Run
To run app use command 
<br>`docker-compose up`

## routes
GET `/bids`
<br>GET `/bid:id`
<br>GET `/auctions`
<br>GET `/auction/:id`
<br>GET `/log:id`
<br>GET `/logs`
<br>POST `/auction/:id/stop`
<br>POST `/auction/:id/start`
<br>POST`/auction`
<br>   body ```{description: String , startingPrice: Number, item: String, email: String}```
<br>POST `/bid`
<br>   body ```{ email: String , auctionId: ObjectId, amount: Number }```

## note
Auction will end automatically in 30 minutes.
