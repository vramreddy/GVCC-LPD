import type { Video } from '../types';

export const MOCK_VIDEOS: Video[] = [
  {
    id: 'course-intro-web',
    title: 'Introduction to Web Development & HTML5',
    description: 'Learn the fundamentals of web page design, markup structuring, semantic elements, and modern video tag integration. Ideal for beginners starting their software engineering journey.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    duration: 596, // 9:56
    category: 'Frontend Development',
    instructor: 'Dr. Sarah Jenkins'
  },
  {
    id: 'course-adv-css',
    title: 'Mastering Advanced CSS Layouts & Typography',
    description: 'Dive deep into Flexbox, CSS Grid, custom properties, media queries, print styling, and fluid responsive spacing systems. Create designs that wow your users without depending on frameworks.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    duration: 653, // 10:53
    category: 'CSS & Design Systems',
    instructor: 'Marcus Aurel'
  },
  {
    id: 'course-react-ts',
    title: 'React & TypeScript: Building Safe & Scalable Web Apps',
    description: 'Learn to leverage typescript type-safety inside React components. Covers state management, asynchronous hooks, props validation, and custom event handlers.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    duration: 848, // 14:08
    category: 'Frontend Frameworks',
    instructor: 'Jane Doe, Lead Engineer'
  },
  {
    id: 'course-browser-sec',
    title: 'Web Application Security & Focus Management Shielding',
    description: 'Understand modern browser security configurations, keycode intercepting, page visibility handlers, drag protections, and techniques to prevent screen recording and client-side data leaks.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    duration: 734, // 12:14
    category: 'Cybersecurity',
    instructor: 'Alex Rivera, Security Specialist'
  },
  {
    id: 'course-system-design',
    title: 'Advanced Full-Stack System Design: Microservices',
    description: 'An overview of large-scale service organization, caching strategies, client polling vs push notification timers, CDN integration, and persistent bookmarking API design.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    duration: 15, // 0:15
    category: 'System Architecture',
    instructor: 'Prof. David Vance'
  }
];
