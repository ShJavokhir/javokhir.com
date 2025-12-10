---
title: "React2Shell in action"
date: "12-09-2025"
description: "How my small Next.js side project got hit by the React2Shell (CVE-2025-55182) vulnerability and what I learned from cleaning it up."
---

Recently, one of my small side projects (not production) was affected by React2Shell (a critical React/Next.js vulnerability tracked as CVE-2025-55182). This is one of the most serious vulnerabilities on the web, with a CVSS 10.0 rating. Below I’ve documented my work.

Check out the article by Google to learn more about this: https://cloud.google.com/blog/products/identity-security/responding-to-cve-2025-55182

## When did I find out I was affected?

It was a normal day and I was deploying some changes to the project. Everything was going well until I received a “disk out-of-space” error when pulling a Docker image into EC2. That was unusual, since I have a huge amount of disk space that’s empty most of the time.

So I rushed to check what was taking up most of the space. Surprisingly, one of the Docker images was taking an unusual amount of space.

I’m a fan of `htop`, and I genuinely enjoy watching CPU/RAM/etc. usage on servers. So of course I opened `htop` to check if there were any unusual processes. Surprisingly enough, the process `next-server` was eating all the CPU.

Then I remembered the React vulnerability I had seen recently and hadn’t paid much attention to (silly me): React2Shell. That was the moment I knew it was over (I mean, it was over for that Docker container).

## What’s React2Shell?

Very short version in my own words:

React2Shell is a serious remote code execution vulnerability in React Server Components that can give an attacker shell access on certain applications using React/Next.js.

The most important part is: if you’re using React Server Components (for example, Next.js apps with the App Router) and you’re on specific vulnerable versions, an attacker can potentially run arbitrary code on your server.

## Reverse engineering (curious me)

Then I remembered a Docker security tip I learned from a guy on YouTube: **“ALWAYS USE A NON-ROOT USER TO RUN PROCESSES.”**

My Next.js app was using a non-root user, which means that if someone pops the app, the process at least doesn’t run as `root` inside the container. That doesn’t make you 100% safe, but it greatly decreases the potential damage.

You don’t let your kid use your admin account on your computer, right? Same idea. Always give your Docker app a non-root account instead of letting it run as `root`.

Long story short, it was crypto-miner malware hiding under the name `docker-daemon` to make us think it’s a legit process.

I don’t know how much they were able to make from my tiny EC2 instance, but it was a good reminder not to ignore security vulnerability alerts on the internet.

## What I did after finding out

I killed and rebuilt the environment with an updated Next.js. I set up CPU/RAM/DISK/NETWORK usage alerts just to get alerts earlier. Yeah, that simple.

## Lessons

- Always use a non-root user to run processes in Docker containers  
- Don't ignore serious vulnerabilities  
- If affected, rotate environment variables ASAP  
- Set up CPU/RAM/etc. usage alerts  
- Have at least basic skills in application security  
