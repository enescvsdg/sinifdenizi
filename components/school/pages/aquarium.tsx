"use client";
import Link from "next/link";
import { Heart, Shell, Star, Utensils, Waves } from "lucide-react";
import Aquarium from "../../aquarium";
import FishCatalog from "../../fish-catalog";
import { Progress } from "../ui";
import { Activities, ClassGoal, Stats } from "../widgets";
import { useSchool } from "../state";
import { assignStudentFish, level } from "@/lib/model";
import { paths } from "@/lib/routes";

export function AquariumPage() {
  const { state, setState, xp, feeding, feedAll, openProfile } = useSchool();
  return (
    <>
      <Stats />
      <div className="ocean-layout">
        <section className="card ocean-card">
          <div className="ocean-heading">
            <div className="ocean-title">
              <span className="icon-tile blue">
                <Waves size={22} />
              </span>
              <div>
                <h2>4-A Sınıf Akvaryumu</h2>
                <p>Birlikte daha renkli, birlikte daha güzel.</p>
              </div>
            </div>
            <div className="class-level">
              <Star size={18} />
              <div>
                <strong>Seviye {level(xp)}</strong>
                <Progress value={(xp % 500) / 5} />
              </div>
            </div>
          </div>
          <Aquarium
            students={state.students}
            decorations={state.decorations}
            xp={xp}
            onSelect={(s) => openProfile(s.id)}
            feeding={feeding}
          />
          <div className="aquarium-toolbar">
            <div>
              <span className="status-dot" /> Denizimiz hayat dolu
            </div>
            <div>
              <Link className="secondary" href={paths.decor}>
                <Shell size={17} />
                Dekorasyonlar
              </Link>
              <button className="feed-button" onClick={feedAll}>
                <Utensils size={17} />
                Balıkları besle
              </button>
            </div>
          </div>
        </section>
        <aside className="ocean-aside">
          <ClassGoal />
          <Activities />
          <div className="quote-card">
            <Heart size={19} />
            <p>
              “Her öğrencinin bir denizi,
              <br />
              her başarının bir izi var.”
            </p>
          </div>
        </aside>
      </div>
      <FishCatalog
        students={state.students}
        onAssign={(id, fish) => setState((s) => assignStudentFish(s, id, fish))}
      />
    </>
  );
}
