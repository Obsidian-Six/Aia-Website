
import React from "react";
import FeatureCard from "../ui/FeatureCard";


const eventCards = [
  {
    id: 1,
    image: "/eventsassets/joint-events-forums.png",
    imageAlt: "Joint Events and Forums",
    title: "Joint Events & Forums",
    description:
      "AIA collaborates with industry associations and partners to organise conferences, forums and networking events that encourage knowledge sharing and strengthen industry engagement",
  },
  {
    id: 2,
    image: "/eventsassets/panel-discusstions.png",
    imageAlt: "Panel Discussions",
    title: "Panel Discussions",
    description:
      "AIA leaders and members contribute to industry discussions, sharing their expertise and perspectives on emerging technologies, automation trends and key industry challenges.",
  },
  {
    id: 3,
    image: "/eventsassets/expo-pavilions.png",
    imageAlt: "Expo Pavilions",
    title: "Expo Pavilions",
    description:
      "AIA participates in major industry exhibitions and trade shows, providing a platform to showcase automation technologies, connect with industry stakeholders and strengthen collaboration across the sector.",
  },
];

export default function EventFeatureSection() {
  return (
    <section className="bg-[#244665] px-5 py-8 sm:px-8 sm:py-10 lg:px-12">
      <div className="mx-auto grid max-w-[1100px] grid-cols-1 items-stretch gap-3 sm:grid-cols-2 lg:grid-cols-3">

        {eventCards.map((card) => (
          <FeatureCard
            key={card.id}
            image={card.image}
            imageAlt={card.imageAlt}
            title={card.title}
            description={card.description}
          />
        ))}

      </div>
    </section>
  );
}
