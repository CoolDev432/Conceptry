import { Car, RocketIcon, Workflow, CheckCheck, User2Icon, Calendar, GraduationCapIcon } from 'lucide-react';
import React from 'react';

const FeaturesContent = [
  {
    head: "AI-Powered Concept Explanations",
    sub: "Get personalized, in-depth explanations of academic topics with the help of advanced AI.",
    icon: <RocketIcon />
  },
  {
    head: "Interactive Diagrams",
    sub: "Visualize complex topics with dynamic, easy-to-understand diagrams.",
    icon: <Workflow />
  },
  {
    head: "Practice Questions Generator",
    sub: "Generate unlimited practice questions with instant solutions to master any concept.",
    icon: <CheckCheck />
  },
  {
    head: "Collaborative",
    sub: "People can share their notes in conceptboards or individual posts and get reviewed by the community, leading to mutual growth.",
    icon: <User2Icon />
  },
  {
    head: "Reminders",
    sub: "Practicing on time is key. To ensure that you are on track, we have a reminder feature which can help you remember which note to revise when.",
    icon: <Calendar />
  },
    {
    head: "Exam Mode",
    sub: "Exams are near? Well supercharge your prep by turning exam mode 'ON', and get specially prepared notes for examinations.",
    icon: <Calendar />
  },
      {
    head: "Classes",
    sub: "The Classes feature in Conceptry brings structured collaboration to concept learning. Teachers can create dedicated class spaces, assign homework, generate AI-powered quizzes, and share explanatory notes with their students—all in one place. Students can join classes using a passcode and access everything from concept notes to assignments. Role-based access ensures teachers manage the content while students focus on learning and submitting responses. This system transforms Conceptry from a solo learning tool into an interactive classroom experience, enhancing both engagement and accountability.",
    icon: <GraduationCapIcon />
  }
];

const Features = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 py-16 px-4 sm:px-10">
      <h1 className="text-white text-7xl font-bold text-center mb-12">Features</h1>
      <Cards />
    </div>
  );
};

const Cards = () => {
  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {FeaturesContent.map((feature, index) => (
        <div
          key={index}
          className="bg-white/10  backdrop-blur-md border border-white/20 rounded-2xl p-6 text-white shadow-lg transition-transform transform hover:border-yellow-300  hover:scale-105 hover:shadow-xl"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-white/20 p-3 rounded-full">
              {
                feature.icon
              }
            </div>
            <h2 className="text-xl font-semibold">{feature.head}</h2>
          </div>
          <p className="text-sm text-gray-300">{feature.sub}</p>
        </div>
      ))}
    </div>
  );
};

export default Features;
