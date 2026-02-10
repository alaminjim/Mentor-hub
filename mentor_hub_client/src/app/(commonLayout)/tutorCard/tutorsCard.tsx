"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { TutorDataType } from "@/type/tutorDataTyp";
import Link from "next/link";

interface TutorCardProps {
  tutor: TutorDataType;
  className?: string;
}

const DAY_LABELS: Record<string, string> = {
  sat: "SAT",
  sun: "SUN",
  mon: "MON",
  tue: "TUE",
  wed: "WED",
  thu: "THU",
  fri: "FRI",
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} width="12" height="12" viewBox="0 0 12 12">
          <polygon
            points="6,1 7.8,4.2 11.4,4.6 8.9,7 9.7,10.6 6,8.6 2.3,10.6 3.1,7 0.6,4.6 4.2,4.2"
            fill={s <= Math.round(rating) ? "#2196c4" : "#c8e6f4"}
          />
        </svg>
      ))}
      <span className="ml-1 text-[11px] font-semibold text-[#2196c4]">
        {Number(rating).toFixed(1)}
      </span>
    </div>
  );
}

const TutorCard = ({ className, tutor }: TutorCardProps) => {
  const [booked, setBooked] = useState(false);
  const [hovered, setHovered] = useState(false);

  const initials = tutor?.name
    ? tutor.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "TU";

  return (
    <div
      className={cn(
        "relative flex h-full flex-col overflow-hidden rounded-2xl transition-all duration-300",
        className,
      )}
      style={{
        background: "#ffffff",
        border: hovered ? "1.5px solid #90cce8" : "1.5px solid #daeef8",
        boxShadow: hovered
          ? "0 16px 48px rgba(33,150,196,0.14)"
          : "0 2px 16px rgba(33,150,196,0.07)",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        transition: "all 0.3s ease",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        style={{
          height: 5,
          flexShrink: 0,
          background: hovered
            ? "linear-gradient(90deg, #1a7fa8 0%, #42b8e0 50%, #1a7fa8 100%)"
            : "linear-gradient(90deg, #2196c4 0%, #7fd3ef 100%)",
          transition: "background 0.3s ease",
        }}
      />

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex items-start gap-3">
          <div
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-[15px] font-extrabold text-white"
            style={{
              background: "linear-gradient(135deg, #2196c4 0%, #56c8ea 100%)",
              boxShadow: "0 6px 18px rgba(33,150,196,0.28)",
              transform: hovered
                ? "rotate(-4deg) scale(1.06)"
                : "rotate(0deg) scale(1)",
              transition: "transform 0.3s cubic-bezier(0.34,1.56,0.64,1)",
              letterSpacing: "0.04em",
            }}
          >
            {initials}
          </div>

          <div className="min-w-0 flex-1">
            <h3
              className="truncate text-[15px] font-bold text-[#0d3d54]"
              style={{ letterSpacing: "-0.025em" }}
            >
              {tutor.name}
            </h3>
            <p className="mt-0.5 text-[11px] font-medium text-[#6aacca]">
              {tutor.experience} experience
            </p>
            <div className="mt-1.5">
              <StarRating rating={tutor.rating ?? 0} />
            </div>
          </div>

          <div
            className="shrink-0 rounded-xl px-3 py-2 text-center"
            style={{
              background: "linear-gradient(135deg, #2196c4 0%, #42b8e0 100%)",
              boxShadow: "0 4px 14px rgba(33,150,196,0.25)",
            }}
          >
            <span className="block text-[20px] font-black leading-none text-white">
              ${tutor.hourlyRate ?? tutor.price}
            </span>
            <span
              className="text-[9px] font-bold uppercase tracking-widest"
              style={{ color: "#c8edf8" }}
            >
              /hr
            </span>
          </div>
        </div>
        <div
          style={{
            height: 1,
            flexShrink: 0,
            background:
              "linear-gradient(90deg, transparent 0%, #c8e8f5 40%, #c8e8f5 60%, transparent 100%)",
          }}
        />

        <p
          className="line-clamp-2 text-[12.5px] leading-relaxed"
          style={{ color: "#4a7a90" }}
        >
          {tutor.bio}
        </p>

        {tutor.subjects?.length > 0 && (
          <div>
            <p
              className="mb-2 text-[9px] font-bold uppercase"
              style={{ letterSpacing: "0.18em", color: "#7bbdd8" }}
            >
              Subjects
            </p>
            <div className="flex flex-wrap gap-1.5">
              {tutor.subjects.map((subject: string, i: number) => (
                <span
                  key={i}
                  className="rounded-lg px-2.5 py-[3px] text-[11px] font-semibold"
                  style={{
                    background: hovered ? "#e0f4fc" : "#eef9fe",
                    border: "1px solid #b8dff0",
                    color: "#1a6f96",
                  }}
                >
                  {subject}
                </span>
              ))}
            </div>
          </div>
        )}

        {tutor.availability && Object.keys(tutor.availability).length > 0 && (
          <div
            className="rounded-xl p-3"
            style={{ background: "#f0f9fe", border: "1px solid #c8e8f5" }}
          >
            <p
              className="mb-2 text-[9px] font-bold uppercase"
              style={{ letterSpacing: "0.18em", color: "#7bbdd8" }}
            >
              Availability
            </p>
            <div className="flex flex-col gap-1.5">
              {Object.entries(tutor.availability).map(([day, slots]) => (
                <div key={day} className="flex items-center gap-2.5">
                  <span
                    className="w-7 text-[10px] font-bold"
                    style={{ color: "#2196c4" }}
                  >
                    {DAY_LABELS[day] ?? day.toUpperCase()}
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {(slots as string[]).map((slot, i) => (
                      <span
                        key={i}
                        className="rounded-md px-2 py-0.5 text-[10px] font-medium"
                        style={{
                          background: "#ffffff",
                          border: "1px solid #b8dff0",
                          color: "#1a6f96",
                        }}
                      >
                        {slot}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <Link href={`/tutorCard/${tutor.id}`}>
          <button
            className="mt-auto w-full rounded-xl py-2.5 text-[12px] font-bold uppercase tracking-[0.12em] text-white transition-all duration-300 active:scale-95"
            style={{
              background: booked
                ? "linear-gradient(135deg, #22a06b, #2ecc94)"
                : hovered
                  ? "linear-gradient(135deg, #1a7fa8, #2196c4)"
                  : "linear-gradient(135deg, #2196c4, #42b8e0)",
              boxShadow: booked
                ? "0 4px 18px rgba(34,160,107,0.3)"
                : "0 4px 18px rgba(33,150,196,0.25)",
            }}
          >
            More Details
          </button>
        </Link>
      </div>
    </div>
  );
};

export { TutorCard };
