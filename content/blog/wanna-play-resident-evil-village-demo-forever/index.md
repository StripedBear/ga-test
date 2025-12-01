---
title: "Wanna play Resident Evil Village demo forever?.."
date: 2021-05-13
description: "A long awaited and critically acclaimed Resident Evil Village is finally here. Set a few years after the horrifying events in the critically acclaimed Resident Evil 7 biohazard, the all-new storyline begins with Ethan Winters and his wife Mia living peacefully in a new location, free from their past nightmares. Just as they are building [\u2026]"
categories:
  - "Articles"
tags:
  - "Resident Evil"
  - "Resident Evil Village"
  - "Resident Evil Village demo"
featured_image: "featured.jpg"
original_url: "https://generalarcade.com/wanna-play-resident-evil-village-demo-forever/"
draft: false
---

A long awaited and critically acclaimed Resident Evil Village is finally here. Set a few years after the horrifying events in the critically acclaimed Resident Evil 7 biohazard, the all-new storyline begins with Ethan Winters and his wife Mia living peacefully in a new location, free from their past nightmares. Just as they are building their new life together, tragedy befalls them once again.

A free demo of this fine product is over and the servers are no longer reachable (yes, the demo was not playable without performing a one-time online authentication). We, of course, tried the demo out when it was just released and it was really a kickass, we liked it a lot. Sadly, we couldn’t try it anymore due to the servers not reachable. Thankfully, we still had the downloaded game files from Steam, so we decided to make it running again, even though the task might seem impossible or “almost” impossible. It was a nice challenge for us and we would like to split the article into two parts: server authorization bypass and extending the demo play time by freezing or resetting the in-game timer.

As a disclaimer, we would like to note that our article is for educational purposes only and the included code is therefore heavily modified. So let’s get started.

**Part I. Server authorization bypass.**

It’s worth mentioning that the demo is protected by Denuvo and that protection requires you to be online while activating the product for the first time you launch the game.

If the activation succeeds, Denuvo stores the cached license file on your system which is valid for a certain period of time (might be about a month in our case) and then you need to activate it again.

We had that file backed up (*%SteamInstallPath%\userdata\%AccountId%\1541780\%license%*) in case something goes wrong and the file gets purged. The first thing to do was to check whether the game uses OpenSSL, libcurl or the plain Windows authentication APIs:

![](attach\_1.jpg)

We’re lucky and the game only uses the WinHttp APIs to contact the server and perform an authentication by receiving the correct response. Ok, so now it’s time to find out what it expects to read. After spending quite some time on finding that out, we’ve finally nailed it. First it sends a GET request to receive a static JSON with a configuration info.

Once again we’re lucky and still could download that file. Next, it sends a POST request which is more interesting. We’ve discovered that it also expects a JSON content response: a JWT token paired with an OAuth 2.0 access token to be precise.

And we, of course, know that every JWT token consists of a header, an actual body and a signature. The header must contain the exact RS256 algorithm and the fixed “kid” value:

*{  
 “typ”:”JWT”,  
 “alg”:”RS256″,  
 “kid”:”aAbBcCdDeEfF”  
}*

The token body must contain the issuer domain name, token grant and expiration time (we used the current timestamp, which is easy to obtain like that):

*auto now = std::chrono::system\_clock::now();  
auto timestamp = std::chrono::duration\_cast(now.time\_since\_epoch()).count();*

and it also must contain two custom properties: Steam user name and Steam ID (64), which we could get by calling the respected Steamworks SDK functions (we used the exact same SDK version, so it wouldn’t bring any possible conflict):

*auto name = SteamFriends()->GetPersonaName();  
auto id = SteamUser()->GetSteamID().ConvertToUint64();*

As for the signature, we generated a random one and encrypted it with a base64 algorithm. The access token part should contain a fixed “ya29” part and also a random cookie data, so we just used the exact same generated signature for the second part.

Great, we figured it out and now it’s time to code a mini server solution that will auto respond to the game requests. We used the one based on an awesome Asio library and also hooked a few WinHttp API functions. Why hooking ? There are a few reasons:

1. To force the usage of HTTP (not the secured HTTPS by default, to disable encryption).
2. To bind the connection to the custom port (in case the default HTTP port is busy).

Ok, we’ve prepared everything for this part and are really eager to know if our solution works.

The game has started, says connecting… *(fingers crossed)* and… we’re in the main menu but there is a red label telling you that the demo has ended and wouldn’t let you play:

![](attach\_2.jpg)

So how do we fix that ? Apparently, the game is checking for the time when JWT token was granted, and to solve the problem, we need to replace the current Unix timestamp with a fake one.

Trying the fixed solution again… and success! We can finally play the game!

**Part II. Bypassing the demo time limit.**

When the hardest part was done, we wanted to know if it’s possible to stop the timer and play the demo for as much as we wanted to. There were two ways: disassembling the binary and patching the timer directly in memory or… just auto clean the demo achievements and the save files?

We’re not going to explain more about the first method, we can only mention that patching a single instruction that sets a specific flag to “1” is enough to freeze the timer completely.

Instead, we would like to mention the second method. The thing is the game uses achievements as a time indicator: 1 hour of the play time is divided into 12 achievements (5,10,15,20,25,30,35,40,45,50,55,60 minutes).

When the game triggers a specific achievement, the timer decreases. So when you enter the game next time, it will update the time for you with a new decreased value.

And here’s our plan to bypass that requirement, so far:

1. Reset all the achievements upon the game start (in case we earned some before).
2. Remove the remote storage file (because it might also store the achievement info).

Sounds easy? Becasuse it is easy! We used the following Steamworks SDK functions to reset (clean) all the available achievements and then remove a specific file:

*SteamUserStats()-ResetAllStats( true );  
SteamRemoteStorage()-FileDelete( “file/path” );*

We tested that method and apparently, it works well. Each time you launch the game, you will have the remaining 1 hour play time.

We would also like to give a small tip to the developers on how to enhance their system a bit: just add a real signature verification of the JWT token, that way it would be way harder to bypass.

P.S.: If you’re a real RE fan, we strongly suggest supporting the developer and [buy the full game](https://store.steampowered.com/agecheck/app/1196590/)!

*Alexei Chernov*
