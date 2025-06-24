-- Fixed Test Data for Funnel Portal
-- This version doesn't reference users that don't exist yet

-- Insert test clients
INSERT INTO clients (name, email, company, avatar, location, rating, bio, phone, website, organization_id) VALUES
('Sarah Chen', 'sarah@techstartup.com', 'Tech Startup Inc', 'https://images.unsplash.com/photo-1494790108755-2616b2f5e2e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40&q=80', 'San Francisco, CA', 4.9, 'CEO of a fast-growing tech startup focused on AI solutions', '+1 (555) 123-4567', 'https://techstartup.com', 1),
('Michael Rodriguez', 'mike@consulting.com', 'Rodriguez Consulting', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40&q=80', 'Austin, TX', 4.8, 'Business consultant specializing in digital transformation', '+1 (555) 987-6543', 'https://rodriguezconsulting.com', 1),
('Emily Johnson', 'emily@ecommerce.com', 'E-Commerce Solutions', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40&q=80', 'New York, NY', 5.0, 'Founder of e-commerce platform helping small businesses', '+1 (555) 456-7890', 'https://ecommercesolutions.com', 1);

-- Insert test projects
INSERT INTO projects (title, description, client_id, organization_id, status, progress, budget, budget_used, priority, team_members, tags) VALUES
('Website Redesign', 'Complete overhaul of the company website with modern design and improved UX', 1, 1, 'active', 65, 15000.00, 9750.00, 'high', '["john-admin", "sarah-designer"]', '["web-design", "ux", "frontend"]'),
('Mobile App Development', 'Native iOS and Android app for customer engagement', 1, 1, 'active', 30, 45000.00, 13500.00, 'high', '["john-admin", "mike-developer"]', '["mobile", "ios", "android", "react-native"]'),
('Digital Marketing Campaign', 'SEO optimization and social media marketing strategy', 2, 1, 'active', 80, 8000.00, 6400.00, 'medium', '["sarah-manager"]', '["marketing", "seo", "social-media"]'),
('E-commerce Platform', 'Custom e-commerce solution with payment integration', 3, 1, 'active', 45, 25000.00, 11250.00, 'high', '["john-admin", "mike-developer"]', '["ecommerce", "payment", "backend"]'),
('Brand Identity Package', 'Complete brand redesign including logo, colors, and guidelines', 2, 1, 'completed', 100, 5000.00, 5000.00, 'medium', '["sarah-designer"]', '["branding", "design", "logo"]');

-- Insert test milestones
INSERT INTO milestones (project_id, title, description, status, due_date, order_index) VALUES
(1, 'Wireframes & Mockups', 'Create initial wireframes and design mockups', 'completed', '2024-01-15', 1),
(1, 'Frontend Development', 'Implement responsive frontend components', 'in_progress', '2024-02-01', 2),
(1, 'Content Migration', 'Migrate existing content to new site', 'pending', '2024-02-15', 3),
(1, 'Testing & Launch', 'QA testing and production deployment', 'pending', '2024-03-01', 4),

(2, 'App Architecture', 'Define app architecture and tech stack', 'completed', '2024-01-10', 1),
(2, 'UI/UX Design', 'Design app interface and user experience', 'in_progress', '2024-01-25', 2),
(2, 'Backend API', 'Develop REST API and database', 'pending', '2024-02-10', 3),
(2, 'Native Development', 'Build iOS and Android apps', 'pending', '2024-03-15', 4);

-- Insert test activities (without user references)
INSERT INTO activities (type, title, description, project_id, client_id, organization_id, metadata) VALUES
('milestone_completed', 'Wireframes Completed', 'All wireframes for the website redesign have been approved', 1, 1, 1, '{"milestone_id": 1, "approved_by": "Sarah Chen"}'),
('message_received', 'Client Feedback Received', 'Sarah provided feedback on the initial designs', 1, 1, 1, '{"message_type": "feedback", "priority": "normal"}'),
('document_uploaded', 'Design Assets Uploaded', 'New logo variations uploaded to project folder', 5, 2, 1, '{"file_count": 5, "file_type": "design"}'),
('payment_received', 'Payment Processed', 'Received milestone payment for brand identity project', 5, 2, 1, '{"amount": 2500, "payment_method": "stripe"}'),
('project_update', 'Progress Update', 'Mobile app UI design is 30% complete', 2, 1, 1, '{"progress": 30, "next_milestone": "UI/UX Design"}');

-- Insert test documents (without user references for now)
INSERT INTO documents (project_id, name, type, url, size) VALUES
(1, 'Website_Wireframes_v2.pdf', 'pdf', '/uploads/wireframes_v2.pdf', 2048576),
(1, 'Brand_Guidelines.pdf', 'pdf', '/uploads/brand_guidelines.pdf', 5242880),
(2, 'App_Mockups.fig', 'figma', '/uploads/app_mockups.fig', 15728640),
(3, 'SEO_Strategy.docx', 'document', '/uploads/seo_strategy.docx', 1048576),
(5, 'Logo_Final.zip', 'archive', '/uploads/logo_final.zip', 3145728);

-- Success message
SELECT 'Fixed test data inserted successfully!' as message;
SELECT 'Ready for next step: Create test users!' as next_step;