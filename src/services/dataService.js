export default class DataService {
  _data = {
    projectRepo: 'https://github.com/BrynnBateman/portfolio',
    react95Repo: 'https://github.com/React95/React95',
    items: [
      {
        id: 'about',
        name: 'About.txt',
        icon: 'info_bubble',
        parentId: 'desktop',
        content: {
          paragraphs: [
            "Hi, I'm Brynn. I've been immersed in software for most of my life, starting at age 11 with Liberty BASIC. My early days were spent building GeoCities sites to host GameBoy emulators and Pokémon ROMs - a passion that eventually evolved into higher-stakes professional work. Throughout my career, I've had the opportunity to build solutions for high-profile clients like Amazon, Salesforce, NetSuite, Oracle, and Goodwill.",
            "Over the past couple of years, I’ve taken a break from the corporate world to travel, reconnect with family, and dive deep into personal passion projects. I've had a life-long love of RPGs, emulation, and deconstructing software, and it remains the center focus of many of my projects. Check out my Projects.txt!",
            "I'm currently looking for a new opportunity in Technical Project or Product Management. I'm living in the Bay Area in California and open to hybrid or remote roles. My resume and other projects are also all discoverable here:",
            "https://github.com/brynnb",
            "https://www.linkedin.com/in/brynn-bateman/",
            "contact2026@brynnbateman.com",
          ],
        },
      },
      {
        id: 'resume',
        name: 'Resume.txt',
        icon: 'notepad_2',
        parentId: 'desktop',
        content: {
          resumeLink:
            'https://docs.google.com/document/d/YOUR_RESUME_ID/export?format=pdf',
          workExperience: [
            {
              jobTitle: 'Software Developer',
              company: 'Your Company',
              location: 'Your Location',
              period: 'START DATE – PRESENT',
              accomplishments: [
                'Building amazing applications',
                'Developed key features from scratch',
                'Technologies used: React, Node.js, etc.',
              ],
            },
          ],
          education: [
            {
              credit: 'Your Degree',
              place: 'Your University',
              gpa: '4.0 GPA',
              period: 'START DATE – END DATE',
            },
          ],
        },
      },
      {
        id: 'projects',
        name: 'Projects.txt',
        icon: 'flying_through_space_100',
        parentId: 'desktop',
        content: {
          projects: [
            {
              title: "IdleQuest",
              description: "A from-the-ground-up recreation of the 1999 classic, EverQuest. It features a custom real-time MMO server built in Go, a bespoke 3D renderer, and an authentic UI painstakingly crafted in React. I spent hundreds of hours meticulously scraping, cleaning, and organizing original data and graphics to recapture the original experience.",
              techStack: "React, Go, WebSockets, MySQL",
              url: "https://idlequest.net",
              repo: "https://github.com/brynnb/idlequest",
            },
            {
              title: "CaptureQuest",
              description: "An expansive 2D multiplayer world built with the Phaser engine. Real-time world interaction, monster collection, and trainer battles, all running in the browser with a custom Go server backend. Also includes a complete data extraction pipeline that parses original Game Boy Pokémon ROM assembly to pull out maps, sprites, encounters, and game logic for use in the web client.",
              techStack: "React, Phaser, Go, WebTransport, MySQL",
              url: "https://capturequest.net",
              repo: "https://github.com/brynnb/capture-quest",
            },
            {
              title: "Focus Tavern",
              description: "A non-profit platform providing accessible tools and resources to individuals with attention and executive function challenges, empowering them through evidence-based productivity methods, education, and supportive community engagement.",
              techStack: "React, TypeScript, Node.js, PostgreSQL, Prisma",
              url: "https://focustavern.com",
              repo: "https://github.com/brynnb/focus-tavern",
            },
            {
              title: "New Yokosuka",
              description: "A web-based asset viewer for the original Dreamcast version of Shenmue that renders binary MT5 models directly in your browser via Babylon.js. It features custom-built parsers and a first-person navigation system for exploring the game's iconic 3D environments.",
              techStack: "Babylon.js, TypeScript, Python, Cloudflare R2",
              url: "https://newyokosuka.com",
              repo: "https://github.com/brynnb/new-yokosuka",
            },
            {
              title: "Ghidra Dreamcast Shenmue",
              description: "A reverse engineering deep-dive into the 1999 Dreamcast classic Shenmue, using Ghidra, an open-source analysis tool created by the NSA. Built a custom processor module and automated pipeline that successfully decoded over 5,000 of the game's internal script functions. A rewarding exploration of low-level systems analysis and tool development.",
              techStack: "Ghidra, SLEIGH, Python, Java",
              repo: "https://github.com/brynnb/ghidra-dreamcast-shenmue",
            },
          ],
        },
      },
      {
        id: 'skills',
        name: 'Skills.txt',
        icon: 'progman_11',
        parentId: 'desktop',
        content: {
          hard: [
            {
              name: 'React',
              progress: 100,
            },
            {
              name: 'JavaScript',
              progress: 100,
            },
            {
              name: 'Node.js',
              progress: 90,
            },
          ],
          soft: 'Analytical thinking, Teamwork, Creative Problem solving',
        },
      },
      {
        id: 'contact',
        name: 'Contact.txt',
        icon: 'inetcfg_2301',
        parentId: 'desktop',
        content: {
          emailText:
            'If you want to hire me or invite to a project, just email me on ',
          email: 'contact2026@brynnbateman.com',
          socialText: 'Or you can reach me out through social media:',
          social: [
            {
              name: 'FaLinkedin',
              link: 'https://www.linkedin.com/in/brynn-bateman/',
            },
            {
              name: 'FaGithub',
              link: 'https://github.com/brynnb',
            },
          ],
        },
      },
      {
        id: 'more-stuff',
        name: 'More Stuff',
        icon: 'folder',
        type: 'folder'
      },
      {
        id: 'secret-stuff',
        name: 'Really Secret Stuff',
        icon: 'folder',
        type: 'folder',
        parentId: 'more-stuff'
      },
      {
        id: 'password-file',
        name: 'password.txt',
        icon: 'notepad_2',
        parentId: 'secret-stuff',
        content: { paragraphs: ['hunter2'] }
      },
    ],
    trash: [
      {
        id: 'resume-copy',
        name: 'resume copy.txt',
        icon: 'notepad_2',
        content: { paragraphs: ['Old version from 2022. Probably outdated.'] }
      },
      {
        id: 'resume-final',
        name: 'resume-copy-final.txt',
        icon: 'notepad_2',
        content: { paragraphs: ['Is this the one? No, wait.'] }
      },
      {
        id: 'resume-final-final',
        name: 'resume-copy-final-final.txt',
        icon: 'notepad_2',
        content: { paragraphs: ['I thought this was the final one.'] }
      },
      {
        id: 'resume-real',
        name: 'resume-final-FOR-REAL.txt',
        icon: 'notepad_2',
        content: { paragraphs: ['This time I mean it. Final.'] }
      }
    ]
  };

  getItems() {
    return this._data.items.map(({ id, name, icon }) => ({ id, name, icon }));
  }

  getTrashItems() {
    return this._data.trash.map(({ id, name, icon }) => ({ id, name, icon }));
  }

  getFolderItems(parentId) {
    if (!parentId) {
      // Main Stuff folder: items that don't have a parentId and aren't folders themselves OR are folders with no parent
      return this._data.items.filter(item => !item.parentId);
    }
    return this._data.items.filter(item => item.parentId === parentId);
  }

  getItem(id) {
    return [...this._data.items, ...this._data.trash].find((x) => x.id === id);
  }

  getProjectInfo() {
    return {
      projectRepo: this._data.projectRepo,
      react95Repo: this._data.react95Repo,
    };
  }
}
