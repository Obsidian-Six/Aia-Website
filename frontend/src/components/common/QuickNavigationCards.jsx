
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarDays,
  Newspaper,
  BookOpen,
  ArrowUpRight,
} from "lucide-react";

const navigationItems = [
  {
    title: "Events",
    description: "Explore upcoming events, conferences and workshops.",
    path: "/events",
    icon: CalendarDays,
    accent: "#E96F62",
  },
  {
    title: "News",
    description: "Read the latest news and updates from AIA.",
    path: "/industry-insight/news",
    icon: Newspaper,
    accent: "#477B9B",
  },
  {
    title: "Articles",
    description: "Discover articles, insights and industry perspectives.",
    path: "/industry-insight/articles",
    icon: BookOpen,
    accent: "#78966A",
  },
];

export default function QuickNavigationCards() {
  const navigate = useNavigate();

  return (
    <section className="w-full bg-white px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-5 md:grid-cols-3">
        {navigationItems.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.title}
              type="button"
              onClick={() => navigate(item.path)}
              className="group relative flex min-h-[210px] flex-col items-start justify-between overflow-hidden rounded-md border border-black bg-white p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-8"
            >
              <div
                className="flex h-12 w-12 items-center justify-center rounded-full"
                style={{
                  backgroundColor: `${item.accent}18`,
                  color: item.accent,
                }}
              >
                <Icon size={25} strokeWidth={1.7} />
              </div>

              <div className="mt-8 w-full">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-2xl font-semibold text-[#17202B]">
                    {item.title}
                  </h3>

                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-black/20 transition-all duration-300 group-hover:border-[#17202B] group-hover:bg-[#17202B] group-hover:text-white">
                    <ArrowUpRight size={18} />
                  </span>
                </div>

                <p className="mt-2 max-w-xs text-sm leading-6 text-gray-600">
                  {item.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
