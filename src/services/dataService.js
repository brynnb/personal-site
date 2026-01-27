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
            "Over the past couple of years, I’ve taken a break from the corporate world to travel, reconnect with family, and dive deep into personal passion projects. I've had a life-long love of emulation and deconstructing software, and it remains the center focus of many of my projects.",
            "My most recent release is IdleQuest, a from-the-ground-up recreation of the 1999 classic, EverQuest. It features a custom real-time MMO server built in Go, a bespoke 3D renderer, and an authentic UI painstakingly crafted in React. I spent hundreds of hours meticulously scraping, cleaning, and organizing original data and graphics to recapture the original experience. You can play it at idlequest.net.",
            "I'm currently looking for a new opportunity in Technical Project or Product Management. I'm based in the Bay Area and open to hybrid or remote roles. My resume and other projects are also all discoverable here!",
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
              title: 'My Portfolio Site',
              description:
                'My personal website in old-school Windows95 design.',
              techStack: 'React',
              repo: 'https://github.com/BrynnBateman/portfolio',
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
