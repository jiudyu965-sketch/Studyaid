import React, { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  BookOpen,
  Calculator,
  FlaskConical,
  Globe2,
  PenLine,
  Sparkles,
  Timer,
  Trophy,
  RefreshCcw,
  CheckCircle2,
  HelpCircle,
  PlayCircle,
  Layers,
} from "lucide-react";

/**
 * Brevet Fun Lab – Single-file React app
 * - Playful UI with gradients + motion
 * - Exercise engine (QCM + réponse courte) for FR, Maths, Histoire-Géo-EMC, Sciences (PC/SVT/Techno)
 * - Exam blanc mode (timer, résultats, correction)
 * - LocalStorage progress
 *
 * All content is in FR to match DNB.
 */

const SUBJECTS = [
  {
    key: "francais",
    label: "Français",
    color: "from-pink-500 via-rose-500 to-fuchsia-500",
    icon: PenLine,
    emoji: "📚",
  },
  {
    key: "maths",
    label: "Maths",
    color: "from-sky-500 via-cyan-500 to-blue-600",
    icon: Calculator,
    emoji: "➗",
  },
  {
    key: "hgeo",
    label: "Histoire-Géo-EMC",
    color: "from-amber-500 via-orange-500 to-red-500",
    icon: Globe2,
    emoji: "🌍",
  },
  {
    key: "sciences",
    label: "Sciences",
    color: "from-emerald-500 via-teal-500 to-green-600",
    icon: FlaskConical,
    emoji: "🧪",
  },
];

// --- Mini bank d'exercices (QCM ou RC) ---
const BANK = {
  francais: [
    {
      id: "fr1",
      type: "qcm",
      question:
        "Dans la phrase : ‘Les élèves que j’ai vus sont partis.’, pourquoi ‘vus’ prend-il un ‘s’ ?",
      choices: [
        "Accord avec ‘élèves’, COD placé avant le verbe",
        "Accord avec ‘j’’, sujet du verbe",
        "Parce que le verbe ‘voir’ s’accorde toujours en nombre",
        "Aucun accord n'est nécessaire",
      ],
      answer: 0,
      explain:
        "Participe passé avec l'auxiliaire *avoir* s'accorde avec le COD si placé avant : ‘que’ = ‘élèves’.",
    },
    {
      id: "fr2",
      type: "rc",
      question:
        "Réécris au discours direct : Elle dit qu’elle viendra demain.",
      placeholder: "Ta réponse...",
      acceptable: [
        "Elle dit : \"Je viendrai demain.\"",
        "Elle dit, \"Je viendrai demain.\"",
      ],
      explain:
        "Discours direct = guillemets et passage à la 1re personne : ‘elle’ → ‘je’, ‘viendra’ → ‘viendrai’.",
    },
    {
      id: "fr3",
      type: "qcm",
      question: "Quel est le registre dominant dans un texte comique ?",
      choices: ["Pathétique", "Lyrique", "Satirique", "Épique"],
      answer: 2,
      explain: "Le comique peut être satirique : il critique en faisant rire.",
    },
  ],
  maths: [
    {
      id: "ma1",
      type: "qcm",
      question:
        "On augmente un prix de 20% puis on le diminue de 20%. Le prix final est-il égal au prix initial ?",
      choices: ["Oui", "Non, il est plus faible", "Non, il est plus élevé", "Impossible à déterminer"],
      answer: 1,
      explain:
        "Ex : 100 → 120 → 96, on perd 4%. Les pourcentages successifs ne s'annulent pas.",
    },
    {
      id: "ma2",
      type: "rc",
      question:
        "Résous : 3x − 5 = 19. Donne la valeur de x.",
      placeholder: "x = ?",
      acceptable: ["8", "x=8", "x = 8"],
      explain: "3x=24 donc x=8.",
    },
    {
      id: "ma3",
      type: "qcm",
      question:
        "Dans un triangle rectangle, le théorème de Pythagore s’écrit…",
      choices: [
        "a + b = c",
        "a^2 + b^2 = c^2",
        "a^2 = b^2 + c^2",
        "2ab = c^2",
      ],
      answer: 1,
      explain: "Somme des carrés des côtés de l’angle droit = carré de l’hypoténuse.",
    },
  ],
  hgeo: [
    {
      id: "hg1",
      type: "qcm",
      question:
        "La Déclaration des droits de l’homme et du citoyen a été adoptée en…",
      choices: ["1776", "1789", "1792", "1815"],
      answer: 1,
      explain: "1789, pendant la Révolution française.",
    },
    {
      id: "hg2",
      type: "rc",
      question:
        "Donne une conséquence majeure de la Première Guerre mondiale pour l’Europe.",
      placeholder: "Ta réponse courte…",
      acceptable: [
        "Pertes humaines massives",
        "Traités redessinent les frontières",
        "Crises économiques et sociales",
      ],
      explain:
        "Plusieurs conséquences : pertes humaines, nouveaux États, instabilité économique…",
    },
    {
      id: "hg3",
      type: "qcm",
      question: "En EMC, la laïcité garantit principalement…",
      choices: [
        "La supériorité d’une religion",
        "La neutralité de l’État et la liberté de conscience",
        "L’obligation de croire",
        "La censure des opinions",
      ],
      answer: 1,
      explain: "La laïcité = neutralité de l’État, libre exercice des cultes, liberté de conscience.",
    },
  ],
  sciences: [
    {
      id: "sc1",
      type: "qcm",
      question:
        "Quelle est l’unité du courant électrique (intensité) dans le S.I. ?",
      choices: ["Volt (V)", "Ohm (Ω)", "Ampère (A)", "Watt (W)"];
      ,
      answer: 2,
      explain: "L’intensité se mesure en ampères.",
    },
    {
      id: "sc2",
      type: "rc",
      question:
        "En SVT, cite une conséquence directe de l’effet de serre renforcé.",
      placeholder: "Ta réponse…",
      acceptable: [
        "Réchauffement climatique",
        "Fonte des glaces",
        "Élévation du niveau de la mer",
        "Événements météorologiques extrêmes",
      ],
      explain:
        "L’augmentation des gaz à effet de serre renforce le RC et ses impacts physiques.",
    },
    {
      id: "sc3",
      type: "qcm",
      question:
        "Le dioxyde de carbone a pour formule…",
      choices: ["CO", "CO2", "O2", "C2O"],
      answer: 1,
      explain: "Le dioxyde de carbone = CO₂ (un atome de carbone, deux d’oxygène).",
    },
  ],
};

// --- Utilitaires ---
const shuffle = (arr) => arr.map((v) => [Math.random(), v]).sort((a, b) => a[0] - b[0]).map(([, v]) => v);
const save = (k, v) => localStorage.setItem(k, JSON.stringify(v));
const load = (k, fallback) => {
  try {
    const v = JSON.parse(localStorage.getItem(k));
    return v ?? fallback;
  } catch {
    return fallback;
  }
};

function Header() {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 opacity-30 blur-3xl">
        <div className="absolute -top-32 -left-16 h-72 w-72 rounded-full bg-gradient-to-tr from-fuchsia-400 to-violet-600" />
        <div className="absolute -bottom-24 -right-10 h-80 w-80 rounded-full bg-gradient-to-tr from-sky-400 to-emerald-500" />
      </div>
      <div className="flex items-center gap-3">
        <Sparkles className="h-6 w-6" />
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Brevet Fun Lab</h1>
      </div>
      <p className="mt-2 text-muted-foreground max-w-2xl">
        Révise le DNB avec style : mini-exercices interactifs, corrections claires & examens blancs chronométrés. C’est fun, artistique et efficace ✨
      </p>
    </div>
  );
}

function SubjectPill({ subject, active, onClick }) {
  const Icon = subject.icon;
  return (
    <button
      onClick={onClick}
      className={`group relative inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
        active
          ? "bg-black/80 text-white shadow"
          : "bg-white/70 hover:bg-white text-gray-800"
      }`}
      style={{ backdropFilter: "saturate(120%) blur(6px)" }}
    >
      <span className={`h-2 w-2 rounded-full bg-gradient-to-r ${subject.color}`} />
      <Icon className="h-4 w-4" />
      {subject.label}
    </button>
  );
}

function ExerciseCard({ ex, onValidate, userAnswer, checked }) {
  const [value, setValue] = useState(userAnswer ?? "");
  useEffect(() => setValue(userAnswer ?? ""), [userAnswer]);
  const isQCM = ex.type === "qcm";

  const correct = isQCM ? userAnswer === ex.answer : ex.acceptable?.some((a) => a.toLowerCase().trim() === (userAnswer ?? "").toLowerCase().trim());

  return (
    <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <HelpCircle className="h-5 w-5" />
          {ex.question}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isQCM ? (
          <div className="grid gap-2">
            {ex.choices.map((c, i) => (
              <Button
                key={i}
                onClick={() => onValidate(i)}
                variant={userAnswer === i ? "default" : "secondary"}
                className="justify-start"
              >
                {String.fromCharCode(65 + i)}. {c}
              </Button>
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Input
              placeholder={ex.placeholder || "Ta réponse"}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") onValidate(value);
              }}
            />
            <Button onClick={() => onValidate(value)}>
              Valider
            </Button>
          </div>
        )}

        {checked && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-xl p-3 text-sm ${
              correct ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
            }`}
          >
            <div className="flex items-center gap-2 font-medium">
              {correct ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <Trophy className="h-4 w-4 rotate-45" />
              )}
              {correct ? "Bravo !" : "Bonne tentative !"}
            </div>
            <p className="mt-1 text-muted-foreground">{ex.explain}</p>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}

function SubjectPanel({ subjectKey }) {
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState(load(`answers:${subjectKey}`, {}));
  const list = BANK[subjectKey];
  const ex = list[idx];

  const checked = answers[ex.id] !== undefined;

  const onValidate = (val) => {
    const next = { ...answers, [ex.id]: val };
    setAnswers(next);
    save(`answers:${subjectKey}`, next);
  };

  const progress = Math.round((Object.keys(answers).length / list.length) * 100);

  return (
    <div className="grid gap-4 md:grid-cols-12">
      <div className="md:col-span-8 space-y-4">
        <ExerciseCard
          ex={ex}
          onValidate={onValidate}
          userAnswer={answers[ex.id]}
          checked={checked}
        />
        <div className="flex items-center justify-between gap-2">
          <Button variant="secondary" onClick={() => setIdx(Math.max(0, idx - 1))} disabled={idx === 0}>
            ← Précédent
          </Button>
          <div className="text-sm text-muted-foreground">
            Exercice {idx + 1} / {list.length}
          </div>
          <Button onClick={() => setIdx(Math.min(list.length - 1, idx + 1))} disabled={idx === list.length - 1}>
            Suivant →
          </Button>
        </div>
      </div>

      <div className="md:col-span-4">
        <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Layers className="h-5 w-5" />
              Ta progression
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span>{progress}%</span>
              <Badge variant="secondary">{Object.keys(answers).length}/{list.length}</Badge>
            </div>
            <Progress value={progress} />
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => {
                setAnswers({});
                save(`answers:${subjectKey}`, {});
              }}
            >
              <RefreshCcw className="h-4 w-4 mr-2" /> Réinitialiser
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function pickRandomQuestions(countPerSubject = 3) {
  const pack = [];
  for (const s of SUBJECTS) {
    const src = BANK[s.key];
    const chosen = shuffle(src).slice(0, Math.min(countPerSubject, src.length));
    for (const q of chosen) pack.push({ ...q, subject: s.key });
  }
  return shuffle(pack);
}

function ExamBlanc() {
  const [state, setState] = useState("idle"); // idle | running | done
  const [timerSec, setTimerSec] = useState(load("exam:timer", 25 * 60)); // 25 min par défaut
  const [paper, setPaper] = useState(load("exam:paper", []));
  const [answers, setAnswers] = useState(load("exam:answers", {}));

  useEffect(() => {
    if (state !== "running") return;
    const id = setInterval(() => setTimerSec((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, [state]);

  useEffect(() => save("exam:timer", timerSec), [timerSec]);
  useEffect(() => save("exam:paper", paper), [paper]);
  useEffect(() => save("exam:answers", answers), [answers]);

  const start = () => {
    setPaper(pickRandomQuestions(3));
    setAnswers({});
    setTimerSec(25 * 60);
    setState("running");
  };

  const stop = () => setState("done");

  const answeredCount = Object.keys(answers).length;
  const score = useMemo(() => {
    let s = 0;
    for (const q of paper) {
      const a = answers[q.id];
      if (a === undefined) continue;
      if (q.type === "qcm" && a === q.answer) s += 1;
      if (q.type === "rc" && q.acceptable?.some((t) => t.toLowerCase().trim() === String(a).toLowerCase().trim())) s += 1;
    }
    return s;
  }, [paper, answers]);

  const total = paper.length;
  const mm = String(Math.floor(timerSec / 60)).padStart(2, "0");
  const ss = String(timerSec % 60).padStart(2, "0");

  return (
    <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Timer className="h-5 w-5" /> Examen blanc (multi-matières)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {state === "idle" && (
          <div className="flex flex-col items-start gap-3">
            <p className="text-muted-foreground">
              Lance un examen blanc de 25 minutes : questions mélangées de chaque matière, corrections à la fin.
            </p>
            <Button onClick={start} className="inline-flex items-center gap-2">
              <PlayCircle className="h-4 w-4" /> Démarrer
            </Button>
          </div>
        )}

        {state === "running" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Badge variant={timerSec <= 60 ? "destructive" : "secondary"}>
                ⏱️ {mm}:{ss}
              </Badge>
              <div className="text-sm text-muted-foreground">
                {answeredCount}/{total} réponses
              </div>
            </div>
            <Separator />
            <div className="grid gap-4">
              {paper.map((q, i) => (
                <div key={q.id} className="space-y-2">
                  <div className="text-xs uppercase tracking-wide text-muted-foreground">
                    {SUBJECTS.find((s) => s.key === q.subject)?.label}
                  </div>
                  <ExerciseCard
                    ex={q}
                    onValidate={(val) => setAnswers((a) => ({ ...a, [q.id]: val }))}
                    userAnswer={answers[q.id]}
                    checked={answers[q.id] !== undefined}
                  />
                </div>
              ))}
            </div>
            <div className="flex items-center justify-end gap-2">
              <Button variant="secondary" onClick={stop}>
                Terminer
              </Button>
            </div>
          </div>
        )}

        {state === "done" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Score : <span className="font-semibold">{score} / {total}</span>
              </div>
              <Badge>Révision</Badge>
            </div>
            <Separator />
            <div className="grid gap-4">
              {paper.map((q) => {
                const got = answers[q.id];
                const good =
                  q.type === "qcm" ? got === q.answer : q.acceptable?.some((t) => t.toLowerCase().trim() === String(got).toLowerCase().trim());
                return (
                  <Card key={q.id} className={`border ${good ? "border-emerald-300" : "border-rose-300"}`}>
                    <CardHeader>
                      <CardTitle className="text-base">{q.question}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm space-y-2">
                      <div>
                        <span className="font-medium">Ta réponse :</span> {String(got ?? "—")}
                      </div>
                      {q.type === "qcm" && (
                        <div>
                          <span className="font-medium">Bonne réponse :</span> {q.choices[q.answer]}
                        </div>
                      )}
                      {q.type === "rc" && (
                        <div>
                          <span className="font-medium">Réponses acceptées :</span> {q.acceptable.join(", ")}
                        </div>
                      )}
                      <p className="text-muted-foreground">{q.explain}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            <div className="flex items-center justify-end gap-2">
              <Button onClick={() => setState("idle")}>Refaire un examen</Button>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}

export default function BrevetFunLab() {
  const [active, setActive] = useState(SUBJECTS[0].key);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 to-slate-100 text-slate-900">
      <div className="mx-auto max-w-6xl px-4 py-8 md:py-12 space-y-8">
        <Header />

        {/* Pills de matières */}
        <div className="flex flex-wrap items-center gap-2">
          {SUBJECTS.map((s) => (
            <SubjectPill key={s.key} subject={s} active={active === s.key} onClick={() => setActive(s.key)} />
          ))}
        </div>

        <Tabs value={active} onValueChange={setActive} className="space-y-6">
          <TabsList className="hidden" />
          {SUBJECTS.map((s) => (
            <TabsContent key={s.key} value={s.key}>
              <div className="grid gap-6 md:grid-cols-12">
                <div className="md:col-span-8 space-y-4">
                  <motion.div
                    key={s.key}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`rounded-2xl p-5 text-white bg-gradient-to-r ${s.color} shadow-lg`}
                  >
                    <div className="flex items-center gap-3">
                      <s.icon className="h-6 w-6" />
                      <div className="text-xl font-semibold">{s.label}</div>
                    </div>
                    <p className="mt-1/5 text-white/90 text-sm">
                      {s.emoji} Exercices courts, corrections immédiates et astuces pour progresser sans stress.
                    </p>
                  </motion.div>

                  <SubjectPanel subjectKey={s.key} />
                </div>
                <div className="md:col-span-4 space-y-4">
                  <ExamBlanc />
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <footer className="pt-6 text-center text-xs text-muted-foreground">
          Conçu avec ❤️ pour rendre les révisions du DNB plus joyeuses. Ajoute facilement tes propres questions dans le code (BANK).
        </footer>
      </div>
    </div>
  );
}
