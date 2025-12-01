---
title: "General Weekly #3 06.15.22"
date: 2022-06-15
description: "The game development industry brings something new all the time. General Arcade shows the most interesting releases, updates and news of the past week, which are recommended reading for both industry veterans and novice developers. In the news: probabilistic programming language MarkovJunior, Blender 3.2 released, Epic Games updated the MetaHuman editor, adding mesh imports and [\u2026]"
categories:
  - "News"
tags:
  - "Unity"
  - "Unreal Engine 5"
featured_image: "featured.jpg"
original_url: "https://generalarcade.com/general-weekly-3-06-15-22/"
draft: false
---

*The game development industry brings something new all the time. General Arcade shows the most interesting releases, updates and news of the past week, which are recommended reading for both industry veterans and novice developers.*

In the news: probabilistic programming language MarkovJunior, Blender 3.2 released, Epic Games updated the MetaHuman editor, adding mesh imports and additional face animations, Rusty Jam 2 and Houdini Game Jam 2022 game jams.

Of interest: an excellent article about the architecture of the Xbox 360, the re-creation of Lilith from the Diablo IV trailer in Maya and ZBrush, the technical post-mortem “Remember …” by Ice-Pick Lodge, quaternions for dummies.

## Updates/releases/news

Blender 3.2 released

{{< youtube "https://www.youtube.com/watch?v=TnX4_BcFY54" >}}

[…as well as presets for lights, looped animations for testing, and compatibility with Unreal Engine 5’s internal tools.](https://www.unrealengine.com/en-US/blog/new-release-brings-mesh-to-metahuman-to-unreal-engine-and-much-more)

Unity has created a new codestyle repository.

![](unity-codestyle-1024x495.png)

You can look [at Github](https://github.com/UnityTechnologies/SolKorCSharpReference/blob/main/CSharpReference.cs).

Unity has decided to shut down Unity Answers and will redirect to the Unity Forums.

![](unity-1024x538.jpg)

At the same time, they [write that](https://forum.unity.com/threads/unity-answers-shutdown.1293360/):

    The functionality of Forums falls short of Answers.

    Migration of all existing answers will most likely not be.

Rusty Jam 2

![](rustyjam-02-1024x852.png)

Applications are [accepted](https://gamedev.rs/blog/rustyjam-02/) from 18 to 26 June. Voting for entries will begin immediately after the end of the jam and will be a week-long.

Houdini Game Jam 2022

![](houdini-game-jam-2022.png)

It will be held for one week from 17 to 24 June 2022. Theme [will be revealed](https://www.sidefx.com/community-main-menu/contests-jams/houdini-game-jam-2022/) on the SideFX Twitch channel on June 17 at 11:00 AM PT. Creators will have one week to create their games and submit them to the Houdini Game Jam ITCH.IO page by 5:00 pm PT on June 24th.

MeshSync now supports Blender nodes right in the Unity editor.

![](GeometryNodesMove-1024x514.gif)

[You can control](https://docs.unity3d.com/Packages/com.unity.meshsync@0.13/manual/GeometryNodes.html) the rendering and transformation of the instance world by modifying the generated game object.

Rust GameDev #34: May 2022

![](raymarch\_ferris\_3d-1024x664.jpg)

[May 2022 news](https://gamedev.rs/news/034/) from the community of game developers on Rasta.

ProRender 3.4 for Blender and Maya released

![](latest-updates-to-radeon-prorender-plug-ins-1024x413.png)

[The updates](https://gpuopen.com/learn/latest-updates-to-radeon-prorender-plug-ins/) add new settings for managing fog and atmosphere, as well as the ability to override shadow settings on objects.

Mesh rendering system for Unity.

{{< youtube "https://www.youtube.com/watch?v=P7mUuCSAX0A" >}}

The system [supports](https://www.indiegogo.com/projects/the-unity-improver-nano-tech/coming_soon) HDRP/URP and is similar to Nanite in UE5.

Making Games for Everyone: The New Unity Learn Course on Accessibility.

![](creating-games-for-everyone-introducing-unity-learns-new-accessibility-course-1024x538.jpg)

Practical Game Accessibility [is a new free online course](https://blog.unity.com/games/creating-games-for-everyone-introducing-unity-learns-new-accessibility-course) to help you prioritize accessibility when creating your game with an inclusive approach to design.

## Interesting articles/videos

[A Gentle Introduction to D3D12.](https://alextardif.com/DX12Tutorial.html)

According to the author, “This guide is meant to jump-start your understanding of DirectX 12. Modern graphics APIs like DirectX 12 can be intimidating to learn at first, and there are few resources that make use of relevant evolutions from the last few years”.

[Excellent article about the architecture of the Xbox 360.](https://www.copetti.org/writings/consoles/xbox-360/)

![](xbox-360-1024x799.jpg)

The new installment in the console architecture series will provide additional insight into early 2000s technologies, with a focus on the emerging “multi-core” processor and the unorthodox symbiosis between the components that allowed engineers to solve seemingly unsolvable. problems.

[Another report on testing in game development.](https://youtu.be/IW5i9DjKT3U)

{{< youtube "https://youtu.be/IW5i9DjKT3U" >}}

Although, in general, nothing new, it will not be worse if you fix the main theses.

    Some testing is better than none at all.

    The profit from the tests will not be visible immediately.

    Making things public purely for the sake of testing is bad.

    You need to test at the place of logic: assertions, etc.

    Stress tests are cool. Helps to catch edge cases due to mass character.

    If you feel that maintaining tests takes too many resources, try changing the granularity.

[How V Rising managed to collect over a million players in a week.](https://newsletter.gamediscover.co/p/how-v-rising-reached-1-million-sales)

![](V-Rising-1024x576.jpg)

GameDiscoverCo talked to the developers and tried to figure out how they did it and whether it is possible to repeat this success.

[Some details about the creation of The Matrix Awakens tech demo on Unreal Engine 5.](https://youtu.be/9S_I-qD7fus)

{{< youtube "https://youtu.be/9S_I-qD7fus" >}}

You can also read the [article on the Epic blog](https://www.unrealengine.com/en-US/spotlights/behind-the-scenes-on-the-matrix-awakens-an-unreal-engine-5-experience).

[Creating a realistic portrait of Jinx in ZBrush, Maya, and Substance 3D](https://80.lv/articles/creating-a-realistic-portrait-of-jinx-in-zbrush-maya-substance-3d/).

![](creating-a-realistic-portrait-of-jinx-in-zbrush-maya-substance-3d-1024x1024.jpg)

Character artist Joshua Gou/Wu shared a detailed description of the Jinx project, explained how her face and outfit were created and discussed the texturing and lighting processes.

[NVIDIA Renders Millions of Lights.](https://youtu.be/MUDveGZIRaM)

{{< youtube "https://youtu.be/MUDveGZIRaM" >}}

The video explains the ReSTIR method and shows comparison between the previous methods.

Additionally, it is shown how it interacts with upscaling techniques.

[Quaternions for dummies.](https://habr.com/ru/post/670438/)

![](Quaternion-1024x640.png)

In the article, using a specific example, the features of using various methods for rotating a 3D object in space are considered. In particular, the application of Euler angles and quaternions is compared.

[A small breakdown of how the dojo scene was created for The Matrix Resurrections using the Unreal Engine.](https://www.unrealengine.com/en-US/spotlights/dneg-creates-the-matrix-resurrections-dojo-scene-with-unreal-engine)

{{< youtube "https://www.youtube.com/watch?v=HygVE6I9LxM" >}}

More in the text.

[Battle Pass: Everything you need to know and more.](https://www.deconstructoroffun.com/blog/2022/6/4/battle-passes-analysis)

![](battle-passes-analysis-1024x576.jpeg)

Battle Passes were first introduced in Valve’s Dota 2 and Team Fortress 2 and then popularized by Fortnite (which still has one of the most advanced and ever-improving designs ever). But they have long ceased to be exclusive to mid-core games and are now present in an ever-growing number of genres.

[A good report about the open-source game Space Station 13.](https://youtu.be/z5sjwqUten0)

{{< youtube "https://youtu.be/z5sjwqUten0" >}}

Discussed the pros/cons of developing an open-source game and talked about interacting with the community.

[Deep Dive: Evolving User Interface and Difficulty Levels in Cook Serve Forever.](https://www.gamedeveloper.com/design/deep-dive-cook-serve-forever-and-difficulty-levels)

![](deep-dive-cook-serve-forever-and-difficulty-levels.png)

Creative Director David Galindo talks about how the Cook Serve Delicious franchise is opening itself up to a whole new audience of players in Cook Serve Forever.

[Work culture and hiring process at The Molasses Flood.](https://80.lv/articles/working-culture-and-the-recruiting-process-at-the-molasses-flood/)

![](working-culture-and-the-recruiting-process-at-the-molasses-flood-1024x576.jpg)

Forrest Dowling from The Molasses Flood studio spoke about the organization of work in the company, explained the hiring process, and talked about the company’s approach to training and burnout management.

[Advanced level design: movie techniques in games, core loops, and silhouettes.](https://habr.com/ru/company/pixonic/blog/669858/)

![](level-design-1024x549.png)

In a new article, the guys from Pixonic deduced several rules of level design, originating from movie techniques, talked about calculating metrics, working with cor-loop, as well as such seemingly simple things as silhouette and color.

[Ghostwire uses the charm of Tokyo to bring an unforgettable user experience.](https://www.unrealengine.com/en-US/developer-interviews/ghostwire-taps-into-the-charm-of-tokyo-to-deliver-a-compelling-experience)

![](ghostwire-taps-into-the-charm-of-tokyo-to-deliver-a-compelling-experience.png)

Epic Games spoke with the team about the studio’s transition from id Tech to Unreal Engine, how the developers created an action game shrouded in horror but adventure, and the studio’s hopes for future technology.

[Real-time rendering – past, present, and likely future.](http://c0de517e.blogspot.com/2022/06/real-time-rendering-past-present-and.html)

![](real-time-rendering-past-present-and.png)

This presentation was a keynote at a private company event but may be helpful.

[Consistent versus Rendezvous – what is the difference between approaches for hashing data on the server.](https://dtf.ru/gamedev/1215676-consistent-protiv-rendezvous-chem-otlichayutsya-podhody-dlya-heshirovaniya-dannyh-na-servere)

![](consistent-protiv-rendezvous-chem-otlichayutsya-podhody-dlya-heshirovaniya-dannyh-na-servere.jpg)

We redistribute the load on the servers and prevent the entire data storage system from collapsing.

[Tutorial for beginners on working with lighting in Unreal Engine.](https://youtu.be/fSbBsXbjxPo)

{{< youtube "https://youtu.be/fSbBsXbjxPo" >}}

William Faucher, a creator of educational content for artists and CGSpectrum mentor, has posted a new video demonstrating how light works in real life and how to implement this photorealistic effect in your projects.

[Updated to 2021 LTS: A Complete Guide to Lighting in the High Definition Render Pipeline.](https://blog.unity.com/games/updated-for-2021-lts-the-definitive-guide-to-lighting-in-the-high-definition-render-pipeline)

![](updated-for-2021-lts-the-definitive-guide-to-lighting-in-the-high-definition-render-pipeline-1024x576.jpg)

The book was created and published late last year to showcase HDRP’s physical lighting capabilities for creating high-quality lighting effects in games. The Unity team received positive feedback from users and has since updated the guide having included the key features of Unity 2021 LTS.

[The history of Glu Mobile: which developer was acquired by Electronic Arts for $2.4 billion.](https://dtf.ru/mobile/1210051-istoriya-glu-mobile-kakogo-razrabotchika-priobrela-electronic-arts-za-2-4-milliarda)

![](istoriya-glu-mobile-kakogo-razrabotchika-priobrela-electronic-arts-za-2-4-milliarda-1024x570.png)

The first mobile online game, how publishers made money on Java games, the progenitor of Pokemon Go – all this and much more in a great material about a mobile company from San Francisco.

[Why does a 3D artist need mathematics: recording a stream with Davyd Vidiger](https://youtu.be/njRSYEe0Rfk).

{{< youtube "https://youtu.be/njRSYEe0Rfk" >}}

The lead technical artist from UNIGINE spun vectors and spaces to talk about real problems using mathematics in 3D graphics.

[Unity Reveals Several Business Ideas for Mobile Game Developers.](https://blog.unity.com/games/growth-and-monetization-report-five-insights-to-help-you-achieve-scale-for-your-mobile-game)

![](growth-and-monetization-report-five-insights-to-help-you-achieve-scale-for-your-mobile-game-1024x629.jpg)

In its first mobile analytics report, the Unity team delved into growth and monetization trends to offer guidance on how to approach topics such as sub-genre selection, soft launches, ad creatives, monetization mixes, ad implementation, and even benchmarking tests.

[A short film entirely created in Unreal Engine.](https://80.lv/articles/creating-a-short-film-entirely-in-unreal-engine/)

{{< youtube "https://www.youtube.com/watch?v=Kiey9JYy250" >}}

Loic Scalbert talked about working on the Seeker project, shared how character animation was created, and talked about what makes Unreal Engine a great tool for filmmaking.

[Game reward system – how updated design can help in development.](https://www.gamedeveloper.com/blogs/rewards-system-for-serious-games---how-a-revised-design-can-aid-in-their-development)

![](rewards-system-for-serious-games-how-a-revised-design-can-aid-in-their-development.png)

How can the reward system help their development? The article explores the reward system for recreational games, makes changes to it and highlights areas for improvement in educational games.

[Magic Bridge Tutorial in Houdini and Unreal Engine.](https://youtu.be/DQW8m16m1L4)

{{< youtube "https://youtu.be/DQW8m16m1L4" >}}

Tutorial creator and Houdini artist Simon Verstraete has released a new video on how to create a magic bridge with a formation effect using Houdini and Unreal Engine. This is just the first part of a two-part tutorial on working with Houdini. In the near future, Simon plans to release a second part devoted to working with the Unreal Engine.

[How the episode Jibaro from Netflix’s Love, Death+Robots was created.](https://youtu.be/JeUuk-g_Qws)

{{< youtube "https://youtu.be/JeUuk-g_Qws" >}}

Director Alberto Mielgo shared “behind the scenes” of the project.

[Creating voxel games with RPG in a Box.](https://80.lv/articles/creating-voxel-style-games-with-rpg-in-a-box/)

![](creating-voxel-style-games-with-rpg-in-a-box-1024x576.jpeg)

Justin Arnold spoke about the features of the RPG in a Box tool, explained why the system uses voxels and shared his plan for the program.

[A new global lighting system in the Kajiya engine.](https://github.com/EmbarkStudios/kajiya/blob/main/docs/gi-overview.md)

{{< youtube "https://www.youtube.com/watch?v=_1g-XhlI_5A" >}}

Tomasz Stochastic demonstrated the new Kajiya global illumination system and spoke in detail about it.

[Recreating Gothic architecture in Substance 3D and Unreal Engine 5.](https://80.lv/articles/recreating-gothic-architecture-in-substance-3d-unreal-engine-5/)

![](recreating-gothic-architecture-in-substance-3d-unreal-engine-5-1024x659.jpeg)

Mika Kuwilsky talked about working on the Gothic Architecture project, shared the lighting setup, and explained how to solve the problem of repeating sections.

[How to turn a 2D fractal into 3D.](https://youtu.be/__dSLc7-Cpo)

{{< youtube "https://youtu.be/__dSLc7-Cpo" >}}

The video shows several ways to do this.

*We thank [Andrei Apanasik](https://suvitruf.ru) for writing the original post and allowing us to publish it on our blog in English.*
