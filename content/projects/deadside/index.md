---
title: "DEADSIDE"
platforms: ["Steam", "Windows"]
client: "tinyBuild"
developer: "Bad Pixel"
publisher: "tinyBuild"
website: "https://www.deadsidegame.com/"
featured_image: "featured.jpg"
draft: false
---

**DEADSIDE** is an Open World Survival Shooter where you challenge yourself in hardcore PVP and PVE encounters. Store valuable loot in safe zones or build your own base. All tied together by tactical gunplay, beautiful visuals, and optimization that'll run on a toaster.

### **Our work:**

**Challenge #1:**

– Ensure reliable data transmission with minimal latency.  
– Handle high-volume data traffic seamlessly.  
– Maintain synchronization across all clients.

_Technical Requirements:_

– Must support real-time transport physics calculations.  
– Ensure data packets are delivered accurately and on time.  
– Integrate seamlessly with the existing game architecture.

**Result:** A network plugin to handle complex transport physics has been implemented.

**Challenge #2:**

– Create a server validation system to protect against cheaters.  
– Constantly updating the system to counter new methods of fraud.

_Technical requirements:_

– Implementation of player input validation to check correct data from the client side.  
– Validation should not burden the server side.  
– Validation should not break players' gameplay when correcting data.

**Result:** A validator has been implemented to protect against cheaters.

**Challenge #3:**

– Increased server stability under high load conditions.  
– Reduce server response time to ensure smooth gaming experience.  
– Implement methods of load balancing and resource management.

_Technical requirements:_

– Use profiling tools to identify performance bottlenecks.  
– Implementation of physical calculations on the client side to avoid load on the server.  
– Conducting stress tests to check server performance under peak loads.

**Result:** The server part is optimized to simultaneously support 20 vehicles and 60 people.
