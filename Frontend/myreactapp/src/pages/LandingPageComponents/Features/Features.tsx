import React from 'react';
import { Camera, Users, BookOpen, BarChart3, Award, Clock, Zap } from 'lucide-react';
import FeatureCard from './FeatureCard';
import RoleFeature from './RoleFeature';

const Features: React.FC = () => {
  return (
    <section id="features" className="py-24 bg-[#121212]">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Revolutionary Features</h2>
          <p className="text-gray-400 text-lg">
            Ai-tendify transforms attendance management with powerful AI technology and intuitive interfaces for all users.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          <FeatureCard 
            icon={<Camera />}
            title="Instant Recognition"
            description="Take attendance with a single photo, automatically identifying and marking all present students."
            color="indigo"
          />
          <FeatureCard 
            icon={<Clock />}
            title="Save Time"
            description="Reduce attendance taking from 5 minutes to seconds, giving more time for actual teaching."
            color="green"
          />
          <FeatureCard 
            icon={<BarChart3 />}
            title="Detailed Analytics"
            description="Track attendance patterns and identify at-risk students with comprehensive reports."
            color="amber"
          />
         
        </div>

        <div className="mb-20">
          <h3 className="text-2xl md:text-3xl font-bold text-white text-center mb-12">Tailored for Every Role</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <RoleFeature
              title="Student Portal"
              description="View your attendance records, compare with class averages, and track your performance across all enrolled subjects."
              features={[
                "Personal profile management",
                "Subject-wise attendance tracking",
                "Comparative analytics with peers",
                "Real-time attendance notifications"
              ]}
              icon={<Users className="h-12 w-12 text-blue-500" />}
              color="blue"
            />
            
            <RoleFeature
              title="Teacher Dashboard"
              description="Take attendance with a photo, manage classes, and identify students who need attendance improvement."
              features={[
                "One-click attendance capture",
                "Class and subject management",
                "Attendance reporting tools",
                "Low attendance alerts"
              ]}
              icon={<BookOpen className="h-12 w-12 text-green-500" />}
              color="green"
            />
            
            <RoleFeature
              title="Department Head View"
              description="Overview of all classes, teachers, and students in your department with comprehensive analytics."
              features={[
                "Department-wide analytics",
                "Teacher performance insights",
                "Student attendance trends",
                "Customizable reporting tools"
              ]}
              icon={<Award className="h-12 w-12 text-amber-500" />}
              color="amber"
            />
            
            <RoleFeature
              title="Admin Controls"
              description="Complete system management including user roles, class promotions, and teacher assignments."
              features={[
                "User role management",
                "Semester transitions",
                "Teacher-subject assignments",
                "System configuration controls"
              ]}
              icon={<Zap className="h-12 w-12 text-purple-500" />}
              color="purple"
            />
          </div>
        </div>

      </div>
    </section>
  );
};

export default Features;