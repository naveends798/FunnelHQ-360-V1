// Mock data for development and testing
export const mockProjects = [
  {
    id: 1,
    title: "E-commerce Platform Redesign",
    description: "Complete overhaul of the existing e-commerce platform with modern UI/UX design and improved performance.",
    status: "active" as const,
    progress: 75,
    budget: 50000,
    budgetUsed: 37500,
    startDate: "2024-01-15",
    endDate: "2024-06-30",
    priority: "high" as const,
    teamMembers: ["Alex Rodriguez", "Sarah Kim", "John Doe"],
    tags: ["E-commerce", "React", "Design"],
    client: {
      id: 1,
      name: "Sarah Johnson",
      company: "TechCorp Inc.",
      avatar: "/avatars/sarah.jpg",
      email: "sarah@techcorp.com"
    }
  },
  {
    id: 2,
    title: "Mobile App Development",
    description: "Native iOS and Android app development for the food delivery service.",
    status: "active" as const,
    progress: 45,
    budget: 75000,
    budgetUsed: 33750,
    startDate: "2024-02-01",
    endDate: "2024-08-15",
    priority: "high" as const,
    teamMembers: ["Mike Chen", "Lisa Zhang"],
    tags: ["Mobile", "React Native", "API"],
    client: {
      id: 2,
      name: "Mike Chen",
      company: "Digital Solutions",
      avatar: "/avatars/mike.jpg",
      email: "mike@digitalsol.com"
    }
  },
  {
    id: 3,
    title: "Website Performance Optimization",
    description: "Improve website loading speed and overall performance metrics.",
    status: "completed" as const,
    progress: 100,
    budget: 25000,
    budgetUsed: 24000,
    startDate: "2024-01-01",
    endDate: "2024-03-15",
    priority: "medium" as const,
    teamMembers: ["Alex Rodriguez"],
    tags: ["Performance", "SEO", "Optimization"],
    client: {
      id: 3,
      name: "Emma Wilson",
      company: "Creative Studio",
      avatar: "/avatars/emma.jpg",
      email: "emma@creative.com"
    }
  },
  {
    id: 4,
    title: "Brand Identity System",
    description: "Complete brand identity design including logo, colors, typography, and guidelines.",
    status: "active" as const,
    progress: 30,
    budget: 40000,
    budgetUsed: 12000,
    startDate: "2024-03-01",
    endDate: "2024-07-30",
    priority: "medium" as const,
    teamMembers: ["Sarah Kim", "John Doe"],
    tags: ["Branding", "Design", "Guidelines"],
    client: {
      id: 4,
      name: "David Brown",
      company: "StartupXYZ",
      avatar: "/avatars/david.jpg",
      email: "david@startupxyz.com"
    }
  },
  {
    id: 5,
    title: "API Integration Project",
    description: "Integrate third-party APIs for payment processing and analytics.",
    status: "paused" as const,
    progress: 20,
    budget: 30000,
    budgetUsed: 6000,
    startDate: "2024-02-15",
    endDate: "2024-05-30",
    priority: "low" as const,
    teamMembers: ["Mike Chen"],
    tags: ["API", "Integration", "Backend"],
    client: {
      id: 5,
      name: "Jennifer Lee",
      company: "FinTech Solutions",
      avatar: "/avatars/jennifer.jpg",
      email: "jennifer@fintech.com"
    }
  },
  {
    id: 6,
    title: "Marketing Website Launch",
    description: "Design and develop a new marketing website with CMS integration.",
    status: "active" as const,
    progress: 60,
    budget: 35000,
    budgetUsed: 21000,
    startDate: "2024-01-20",
    endDate: "2024-04-30",
    priority: "high" as const,
    teamMembers: ["Sarah Kim", "Alex Rodriguez", "Lisa Zhang"],
    tags: ["Website", "CMS", "Marketing"],
    client: {
      id: 6,
      name: "Robert Taylor",
      company: "Marketing Pro",
      avatar: "/avatars/robert.jpg",
      email: "robert@marketingpro.com"
    }
  }
];

export const mockClients = [
  {
    id: 1,
    name: "Sarah Johnson",
    company: "TechCorp Inc.",
    email: "sarah@techcorp.com",
    avatar: "/avatars/sarah.jpg",
    phone: "+1 (555) 123-4567",
    industry: "Technology",
    companySize: "51-200 employees",
    website: "https://techcorp.com",
    address: "123 Tech Street, San Francisco, CA 94105",
    tags: ["Enterprise", "Long-term"],
    status: "active"
  },
  {
    id: 2,
    name: "Mike Chen",
    company: "Digital Solutions",
    email: "mike@digitalsol.com",
    avatar: "/avatars/mike.jpg",
    phone: "+1 (555) 234-5678",
    industry: "Digital Marketing",
    companySize: "11-50 employees",
    website: "https://digitalsol.com",
    address: "456 Digital Ave, Austin, TX 78701",
    tags: ["SMB", "Recurring"],
    status: "active"
  },
  {
    id: 3,
    name: "Emma Wilson",
    company: "Creative Studio",
    email: "emma@creative.com",
    avatar: "/avatars/emma.jpg",
    phone: "+1 (555) 345-6789",
    industry: "Design",
    companySize: "1-10 employees",
    website: "https://creativestudio.com",
    address: "789 Art District, Portland, OR 97205",
    tags: ["Creative", "Boutique"],
    status: "active"
  }
];

export const mockTeamMembers = [
  {
    id: 1,
    name: "Alex Rodriguez",
    role: "Full Stack Developer",
    email: "alex@company.com",
    avatar: "/avatars/alex.jpg",
    status: "active",
    skills: ["React", "Node.js", "TypeScript", "PostgreSQL"],
    joinDate: "2023-01-15"
  },
  {
    id: 2,
    name: "Sarah Kim",
    role: "UI/UX Designer",
    email: "sarah@company.com",
    avatar: "/avatars/sarah.jpg",
    status: "active",
    skills: ["Figma", "Adobe Creative Suite", "User Research", "Prototyping"],
    joinDate: "2023-03-01"
  },
  {
    id: 3,
    name: "John Doe",
    role: "Project Manager",
    email: "john@company.com",
    avatar: "/avatars/john.jpg",
    status: "active",
    skills: ["Agile", "Scrum", "Risk Management", "Stakeholder Communication"],
    joinDate: "2022-11-10"
  },
  {
    id: 4,
    name: "Lisa Zhang",
    role: "QA Engineer",
    email: "lisa@company.com",
    avatar: "/avatars/lisa.jpg",
    status: "active",
    skills: ["Test Automation", "Selenium", "Jest", "Quality Assurance"],
    joinDate: "2023-05-20"
  },
  {
    id: 5,
    name: "Mike Chen",
    role: "Backend Developer",
    email: "mike@company.com",
    avatar: "/avatars/mike.jpg",
    status: "active",
    skills: ["Python", "Django", "API Design", "Database Optimization"],
    joinDate: "2023-02-14"
  }
];

export const mockStats = {
  totalProjects: mockProjects.length,
  activeProjects: mockProjects.filter(p => p.status === "active").length,
  completedProjects: mockProjects.filter(p => p.status === "completed").length,
  totalRevenue: mockProjects.reduce((sum, p) => sum + p.budgetUsed, 0),
  totalBudget: mockProjects.reduce((sum, p) => sum + p.budget, 0),
  totalClients: mockClients.length,
  teamMembers: mockTeamMembers.length
};