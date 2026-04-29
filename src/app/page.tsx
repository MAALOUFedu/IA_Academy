'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

import {
  Brain,
  BookOpen,
  Code2,
  Cpu,
  Database,
  Download,
  FlaskConical,
  BarChart3,
  Clock,
  Rocket,
  Target,
  TrendingUp,
  Zap,
  GitBranch,
  GraduationCap,
  ExternalLink,
  Trash2,
  Plus,
  RotateCcw,
  Send,
  Mail,
  Github,
  Menu,
  ChevronRight,
  ChevronDown,
  ChevronLeft,
  CheckCircle2,
  Lightbulb,
  AlertTriangle,
  XCircle,
  FileCode2,
  Layers,
  Activity,
  Sparkles,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Equal,
  Ruler,
  Dice5,
  RefreshCw,
  Scale,
  Clipboard,
  Check,
  Search,
  Upload,
  Keyboard,
  Command,
  Bookmark,
  StickyNote,
  BookMarked,
  Shuffle,
  Star,
  Quote,
  Timer,
  Play,
  Pause,
  SkipForward,
  HelpCircle,
  Sun,
  Moon,
  Pencil,
  Trophy,
  Compass,
  Flame,
  Award,
  Lock,
  FileText,
  Shield,
  Eye,
  EyeOff,
  Footprints,
  Inbox,
  MessageSquare,
  Calendar,
  User,
  Loader2,
  Save,
  Settings,
  Monitor,
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────
interface TPData {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  duration: string;
  color: string;
  colabUrl: string;
  kaggleUrl: string;
  datasetName: string;
  datasetRows: string;
  datasetCols: string;
  objective: string;
  expectedResult: string;
  steps: string;
  concepts: string;
  tags: string;
  order: number;
  createdAt: string;
  updatedAt: string;
  notebooks?: Array<{ id: string; title: string; fileName: string; filePath: string; fileSize: number; chapter: string; visible: boolean; createdAt: string; updatedAt: string; }>;
}

type TabId = 'accueil' | 'cours' | 'tps' | 'contact' | 'admin';
type CourseSectionId = 'intro' | 'regression' | 'logistique' | 'randomforest' | 'neural' | 'lstm' | 'metriques' | 'optimisation';

// ─── Code Block Component ────────────────────────────────────────────
function CodeBlock({ code, language = 'python' }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback silently
    }
  };

  return (
    <div className="rounded-lg overflow-hidden border border-border my-4">
      <div className="bg-secondary/80 px-4 py-2 flex items-center justify-between border-b border-border">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/70" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
            <div className="w-3 h-3 rounded-full bg-green-500/70" />
          </div>
          <span className="text-xs text-muted-foreground ml-2 font-mono">{language}</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded hover:bg-secondary"
          aria-label="Copier le code"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copié !</span>
            </>
          ) : (
            <>
              <Clipboard className="w-3.5 h-3.5" />
              <span>Copier</span>
            </>
          )}
        </button>
      </div>
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          padding: '1rem',
          background: '#0d0d1a',
          fontSize: '0.8rem',
          lineHeight: '1.6',
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}

// ─── Callout Component ───────────────────────────────────────────────
function Callout({ type, children }: { type: 'tip' | 'warning' | 'info' | 'danger'; children: React.ReactNode }) {
  const config = {
    tip: { icon: Lightbulb, bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-400', label: 'Astuce' },
    warning: { icon: AlertTriangle, bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', text: 'text-yellow-400', label: 'Attention' },
    info: { icon: CheckCircle2, bg: 'bg-primary/10', border: 'border-primary/30', text: 'text-primary-foreground', label: 'Info' },
    danger: { icon: XCircle, bg: 'bg-destructive/10', border: 'border-destructive/30', text: 'text-destructive', label: 'Important' },
  };
  const { icon: Icon, bg, border, text, label } = config[type];
  return (
    <div className={`${bg} ${border} border rounded-lg p-4 my-4`}>
      <div className="flex items-start gap-3">
        <Icon className={`w-5 h-5 ${text} mt-0.5 shrink-0`} />
        <div>
          <span className={`text-sm font-semibold ${text}`}>{label}: </span>
          <span className="text-sm text-muted-foreground">{children}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Pros/Cons Component ─────────────────────────────────────────────
function ProsCons({ pros, cons }: { pros: string[]; cons: string[] }) {
  return (
    <div className="grid md:grid-cols-2 gap-4 my-4">
      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4">
        <h4 className="text-emerald-400 font-semibold mb-3 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" /> Avantages
        </h4>
        <ul className="space-y-2">
          {pros.map((p, i) => (
            <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
              <ChevronRight className="w-3 h-3 text-emerald-400 mt-1 shrink-0" />
              {p}
            </li>
          ))}
        </ul>
      </div>
      <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
        <h4 className="text-red-400 font-semibold mb-3 flex items-center gap-2">
          <XCircle className="w-4 h-4" /> Limites
        </h4>
        <ul className="space-y-2">
          {cons.map((c, i) => (
            <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
              <ChevronRight className="w-3 h-3 text-red-400 mt-1 shrink-0" />
              {c}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ─── Animated Counter Component ──────────────────────────────────────
function AnimatedCounter({ target, suffix = '', duration = 1.5, delay = 0 }: { target: number; suffix?: string; duration?: number; delay?: number }) {
  const [count, setCount] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;

    const timeout = setTimeout(() => {
      const startTime = performance.now();
      const durationMs = duration * 1000;

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / durationMs, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setCount(Math.round(eased * target));

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    }, delay);

    return () => clearTimeout(timeout);
  }, [target, duration, delay]);

  return (
    <span className="tabular-nums">
      {count}{suffix}
    </span>
  );
}

// ─── Confetti Function ──────────────────────────────────────────
function triggerConfetti() {
  if (typeof document === 'undefined') return;
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const colors = ['#6366f1', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444', '#ec4899'];
  const particles: { x: number; y: number; vx: number; vy: number; color: string; size: number; rotation: number; rotSpeed: number; shape: 'rect' | 'circle' }[] = [];
  for (let i = 0; i < 150; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      vx: (Math.random() - 0.5) * 8,
      vy: Math.random() * 3 + 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 8 + 4,
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 10,
      shape: Math.random() > 0.5 ? 'rect' : 'circle',
    });
  }
  let frame = 0;
  const maxFrames = 180;
  const animate = () => {
    if (frame >= maxFrames) { document.body.removeChild(canvas); return; }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const opacity = frame > maxFrames - 60 ? (maxFrames - frame) / 60 : 1;
    ctx.globalAlpha = opacity;
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.1;
      p.rotation += p.rotSpeed;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;
      if (p.shape === 'rect') {
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
    frame++;
    requestAnimationFrame(animate);
  };
  animate();
}

// ─── Course Sections Data ────────────────────────────────────────────
interface CourseSection {
  id: CourseSectionId;
  title: string;
  icon: React.ReactNode;
  readingTime: number;
  content: React.ReactNode;
}

const courseSections: CourseSection[] = [
  {
    id: 'intro',
    title: 'Introduction au ML',
    icon: <Brain className="w-5 h-5" />,
    readingTime: 2,
    content: (
      <div className="space-y-6">
        <div>
          <h3 className="text-2xl font-bold mb-4">Qu&apos;est-ce que le Machine Learning ?</h3>
          <p className="text-muted-foreground leading-relaxed">
            Le Machine Learning (apprentissage automatique) est un sous-domaine de l&apos;intelligence artificielle
            qui permet aux ordinateurs d&apos;apprendre à partir de données, sans être explicitement programmés.
            Au lieu d&apos;écrire des règles manuellement, on fournit des exemples au modèle qui va en déduire
            les patterns et relations lui-même.
          </p>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-3">Les 3 types d&apos;apprentissage</h4>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                title: 'Supervisé',
                desc: "L'algorithme apprend à partir de données labelisées (input → output). Exemples : classification d'emails, prédiction de prix.",
                color: 'bg-blue-500/10 border-blue-500/20',
                iconColor: 'text-blue-400',
              },
              {
                title: 'Non Supervisé',
                desc: "L'algorithme trouve des structures dans des données non labelisées. Exemples : segmentation clients, détection d'anomalies.",
                color: 'bg-purple-500/10 border-purple-500/20',
                iconColor: 'text-purple-400',
              },
              {
                title: 'Par Renforcement',
                desc: "L'agent apprend par essais/erreurs en interagissant avec un environnement. Exemples : jeux vidéo, robots autonomes.",
                color: 'bg-amber-500/10 border-amber-500/20',
                iconColor: 'text-amber-400',
              },
            ].map((item) => (
              <div key={item.title} className={`${item.color} border rounded-lg p-4`}>
                <h5 className={`font-semibold mb-2 ${item.iconColor}`}>{item.title}</h5>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-3">Le Pipeline ML</h4>
          <p className="text-muted-foreground mb-4">
            Un projet de Machine Learning suit généralement ces étapes :
          </p>
          <CodeBlock
            language="text"
            code={`1. Collecte des données → 2. Exploration & Nettoyage → 3. Feature Engineering
4. Division Train/Test → 5. Entraînement du modèle → 6. Évaluation
7. Optimisation (Hyperparamètres) → 8. Déploiement`}
          />
        </div>

        <Callout type="info">
          Dans cette formation, nous nous concentrerons principalement sur l&apos;apprentissage supervisé,
          qui est le type le plus courant et le plus directement applicable en industrie.
        </Callout>
      </div>
    ),
  },
  {
    id: 'regression',
    title: 'Régression Linéaire',
    icon: <TrendingUp className="w-5 h-5" />,
    readingTime: 3,
    content: (
      <div className="space-y-6">
        <div>
          <h3 className="text-2xl font-bold mb-4">Régression Linéaire</h3>
          <p className="text-muted-foreground leading-relaxed">
            La régression linéaire est l&apos;un des algorithmes les plus fondamentaux en Machine Learning.
            Elle modélise la relation entre une variable dépendante y et une ou plusieurs variables
            indépendantes x en ajustant une ligne droite (ou hyperplan) aux données.
          </p>
        </div>

        <div className="bg-secondary/50 border border-border rounded-lg p-4">
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            <FileCode2 className="w-4 h-4 text-primary" /> Formule Mathématique
          </h4>
          <div className="font-mono text-sm text-primary-foreground space-y-1">
            <p>• Simple : y = wx + b</p>
            <p>• Multiple : y = w₁x₁ + w₂x₂ + ... + wₙxₙ + b</p>
            <p>• Fonction de perte (MSE) : L = (1/n) Σ(yᵢ - ŷᵢ)²</p>
          </div>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-2">Exemple concret</h4>
          <p className="text-muted-foreground mb-4">
            Pour prédire le prix d&apos;une maison : y = prix, x₁ = superficie, x₂ = nombre de chambres, etc.
            Le modèle va trouver les meilleurs poids w qui minimisent l&apos;erreur entre les prédictions et les vrais prix.
          </p>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-2">Implémentation Python</h4>
          <CodeBlock
            code={`import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score

# Données d'exemple : superficie (m²) et prix (€)
X = np.array([[50], [80], [100], [120], [150], [180], [200]])
y = np.array([150000, 200000, 250000, 280000, 350000, 420000, 480000])

# Division train/test
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Création et entraînement du modèle
model = LinearRegression()
model.fit(X_train, y_train)

# Prédiction
y_pred = model.predict(X_test)

# Évaluation
print(f"Coefficient (w): {model.coef_[0]:.2f}")
print(f"Intercept (b): {model.intercept_:.2f}")
print(f"R² Score: {r2_score(y_test, y_pred):.4f}")
print(f"RMSE: {np.sqrt(mean_squared_error(y_test, y_pred)):.2f} €")

# Prédire pour une maison de 130 m²
prix_predit = model.predict([[130]])
print(f"Prix prédit pour 130m²: {prix_predit[0]:,.0f} €")`}
          />
        </div>

        <ProsCons
          pros={[
            'Simple à comprendre et à implémenter',
            'Rapide à entraîner',
            'Interprétable (on peut lire les coefficients)',
            'Bonne baseline pour les relations linéaires',
            'Peu de paramètres à régler',
          ]}
          cons={[
            "Suppose une relation linéaire entre les variables",
            "Sensible aux outliers (valeurs aberrantes)",
            "Ne gère pas les relations non-linéaires complexes",
            "Peut sous-apprendre (underfitting) les données complexes",
          ]}
        />

        <Callout type="tip">
          La régression linéaire est un excellent point de départ pour tout problème de régression.
          Commencez toujours par ce modèle comme baseline avant d&apos;essayer des algorithmes plus complexes.
        </Callout>
      </div>
    ),
  },
  {
    id: 'logistique',
    title: 'Régression Logistique',
    icon: <Target className="w-5 h-5" />,
    readingTime: 3,
    content: (
      <div className="space-y-6">
        <div>
          <h3 className="text-2xl font-bold mb-4">Régression Logistique</h3>
          <p className="text-muted-foreground leading-relaxed">
            Malgré son nom, la régression logistique est un algorithme de classification (binaire ou multiclasse).
            Elle utilise la fonction sigmoïde pour transformer la sortie d&apos;une régression linéaire en une
            probabilité entre 0 et 1.
          </p>
        </div>

        <div className="bg-secondary/50 border border-border rounded-lg p-4">
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            <FileCode2 className="w-4 h-4 text-primary" /> Fonction Sigmoïde
          </h4>
          <div className="font-mono text-sm text-primary-foreground space-y-1">
            <p>σ(z) = 1 / (1 + e⁻ᶻ)</p>
            <p>où z = wx + b</p>
            <p>Si σ(z) ≥ 0.5 → Classe 1, sinon → Classe 0</p>
          </div>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-2">Cas d&apos;usage : Titanic</h4>
          <p className="text-muted-foreground mb-4">
            Pour classer les passagers du Titanic : survived (1) ou non (0) en fonction de l&apos;âge,
            du sexe, de la classe, etc. La régression logistique va calculer la probabilité de survie
            pour chaque passager.
          </p>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-2">Implémentation Python</h4>
          <CodeBlock
            code={`import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import accuracy_score, classification_report, roc_auc_score

# Chargement des données
df = pd.read_csv('titanic.csv')

# Prétraitement
df['Age'].fillna(df['Age'].median(), inplace=True)
df['Embarked'].fillna(df['Embarked'].mode()[0], inplace=True)
le = LabelEncoder()
df['Sex'] = le.fit_transform(df['Sex'])

features = ['Pclass', 'Sex', 'Age', 'Fare', 'SibSp', 'Parch']
X = df[features]
y = df['Survived']

# Normalisation
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Division et entraînement
X_train, X_test, y_train, y_test = train_test_split(
    X_scaled, y, test_size=0.2, random_state=42
)

model = LogisticRegression(max_iter=1000)
model.fit(X_train, y_train)

# Évaluation
y_pred = model.predict(X_test)
print(f"Accuracy: {accuracy_score(y_test, y_pred):.4f}")
print(f"ROC-AUC: {roc_auc_score(y_test, model.predict_proba(X_test)[:,1]):.4f}")
print("\\nRapport de classification:")
print(classification_report(y_test, y_pred))`}
          />
        </div>

        <ProsCons
          pros={[
            'Probabilités interprétables',
            'Efficace pour les problèmes linéairement séparables',
            'Pas de surapprentissage avec régularisation',
            'Facile à implémenter et rapide',
          ]}
          cons={[
            "Hypothèse de frontière de décision linéaire",
            "Moins performant sur des relations non-linéaires",
            "Nécessite un encodage des variables catégorielles",
            "Sensible aux features non corrélées",
          ]}
        />
      </div>
    ),
  },
  {
    id: 'randomforest',
    title: 'Random Forest',
    icon: <Database className="w-5 h-5" />,
    readingTime: 3,
    content: (
      <div className="space-y-6">
        <div>
          <h3 className="text-2xl font-bold mb-4">Random Forest (Forêt Aléatoire)</h3>
          <p className="text-muted-foreground leading-relaxed">
            Le Random Forest est un algorithme d&apos;ensemble (ensemble learning) qui combine plusieurs arbres
            de décision pour produire une prédiction plus robuste. Il utilise la technique de <strong>bagging</strong> :
            chaque arbre est entraîné sur un sous-ensemble aléatoire des données et des features.
          </p>
        </div>

        <div className="bg-secondary/50 border border-border rounded-lg p-4">
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            <FileCode2 className="w-4 h-4 text-primary" /> Hyperparamètres Clés
          </h4>
          <div className="text-sm text-muted-foreground space-y-2">
            <p><strong className="text-foreground">n_estimators</strong> (défaut: 100) — Nombre d&apos;arbres dans la forêt. Plus c&apos;est, mieux c&apos;est (mais plus lent).</p>
            <p><strong className="text-foreground">max_depth</strong> (défaut: None) — Profondeur maximale de chaque arbre. Contrôle le surapprentissage.</p>
            <p><strong className="text-foreground">min_samples_split</strong> (défaut: 2) — Nombre minimum d&apos;échantillons pour diviser un nœud.</p>
            <p><strong className="text-foreground">max_features</strong> (défaut: &quot;sqrt&quot;) — Nombre de features considérées pour chaque split.</p>
          </div>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-2">Feature Importance</h4>
          <p className="text-muted-foreground mb-4">
            Un avantage majeur du Random Forest est sa capacité à évaluer l&apos;importance de chaque feature.
            Cela permet de comprendre quelles variables influencent le plus les prédictions.
          </p>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-2">Implémentation Python</h4>
          <CodeBlock
            code={`from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import GridSearchCV
import matplotlib.pyplot as plt
import numpy as np

# Random Forest de base
rf = RandomForestClassifier(n_estimators=200, max_depth=10, random_state=42)
rf.fit(X_train, y_train)

# Recherche des meilleurs hyperparamètres
param_grid = {
    'n_estimators': [100, 200, 300],
    'max_depth': [5, 10, 15, None],
    'min_samples_split': [2, 5, 10],
    'max_features': ['sqrt', 'log2']
}

grid_search = GridSearchCV(rf, param_grid, cv=5, scoring='accuracy', n_jobs=-1)
grid_search.fit(X_train, y_train)
print(f"Meilleurs paramètres: {grid_search.best_params_}")
print(f"Meilleur score CV: {grid_search.best_score_:.4f}")

# Feature Importance
importances = grid_search.best_estimator_.feature_importances_
feature_names = X.columns if hasattr(X, 'columns') else [f'Feature {i}' for i in range(len(importances))]
sorted_idx = np.argsort(importances)[::-1]

plt.figure(figsize=(10, 6))
plt.bar(range(len(importances)), importances[sorted_idx])
plt.xticks(range(len(importances)), [feature_names[i] for i in sorted_idx], rotation=45)
plt.title('Feature Importance - Random Forest')
plt.tight_layout()
plt.show()`}
          />
        </div>

        <ProsCons
          pros={[
            'Performant sur la plupart des datasets sans tuning',
            "Gère naturellement les relations non-linéaires",
            "Résistant au surapprentissage (grâce au bagging)",
            "Fournit la feature importance",
            "Peut gérer les valeurs manquantes (version sklearn ≥ 1.4)",
          ]}
          cons={[
            "Plus lent qu'un seul arbre de décision",
            "Moins interprétable qu'un seul arbre",
            "Peut être biaisé si les features sont très corrélées",
            "Consomme plus de mémoire (stocke tous les arbres)",
          ]}
        />

        <Callout type="tip">
          Pour les datasets tabulaires, le Random Forest est souvent l&apos;un des meilleurs algorithmes
          &quot;out-of-the-box&quot;. Il constitue un excellent benchmark avant d&apos;essayer des méthodes plus complexes
          comme le Gradient Boosting (XGBoost, LightGBM).
        </Callout>
      </div>
    ),
  },
  {
    id: 'neural',
    title: 'Réseaux de Neurones',
    icon: <Cpu className="w-5 h-5" />,
    readingTime: 3,
    content: (
      <div className="space-y-6">
        <div>
          <h3 className="text-2xl font-bold mb-4">Réseaux de Neurones</h3>
          <p className="text-muted-foreground leading-relaxed">
            Les réseaux de neurones artificiels sont inspirés du fonctionnement du cerveau humain.
            Ils sont composés de couches de neurones interconnectés qui transforment progressivement
            les données d&apos;entrée en sortie. Ils sont à la base du Deep Learning.
          </p>
        </div>

        <div className="bg-secondary/50 border border-border rounded-lg p-4">
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            <FileCode2 className="w-4 h-4 text-primary" /> Propagation
          </h4>
          <div className="text-sm text-muted-foreground space-y-2">
            <p><strong className="text-foreground">Forward Propagation</strong> — Les données traversent le réseau de l&apos;entrée vers la sortie. Chaque neurone calcule : a = σ(Wx + b)</p>
            <p><strong className="text-foreground">Backward Propagation</strong> — L&apos;erreur est calculée et propagée en arrière pour ajuster les poids via la descente de gradient.</p>
          </div>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-3">Fonctions d&apos;Activation</h4>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { name: 'ReLU', formula: 'f(x) = max(0, x)', desc: 'Plus utilisée. Rapide, résout le problème du gradient qui s\'évanouit.', color: 'text-blue-400' },
              { name: 'Sigmoid', formula: 'f(x) = 1/(1+e⁻ˣ)', desc: 'Sortie entre 0 et 1. Utilisée pour la classification binaire en couche de sortie.', color: 'text-purple-400' },
              { name: 'Softmax', formula: 'f(xᵢ) = eˣⁱ / Σeˣʲ', desc: 'Distribution de probabilités. Pour classification multiclasse en sortie.', color: 'text-amber-400' },
              { name: 'Tanh', formula: 'f(x) = (eˣ-e⁻ˣ)/(eˣ+e⁻ˣ)', desc: 'Sortie entre -1 et 1. Centre les données autour de 0.', color: 'text-emerald-400' },
            ].map((fn) => (
              <div key={fn.name} className="bg-secondary/30 border border-border rounded-lg p-3">
                <h5 className={`font-semibold ${fn.color}`}>{fn.name}</h5>
                <p className="font-mono text-xs text-primary-foreground my-1">{fn.formula}</p>
                <p className="text-xs text-muted-foreground">{fn.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-2">Implémentation Keras</h4>
          <CodeBlock
            code={`import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers

# Création du modèle
model = keras.Sequential([
    layers.Dense(128, activation='relu', input_shape=(X_train.shape[1],)),
    layers.Dropout(0.3),
    layers.Dense(64, activation='relu'),
    layers.Dropout(0.2),
    layers.Dense(32, activation='relu'),
    layers.Dense(1, activation='sigmoid')  # Classification binaire
])

# Compilation
model.compile(
    optimizer='adam',
    loss='binary_crossentropy',
    metrics=['accuracy']
)

# Entraînement avec early stopping
early_stop = keras.callbacks.EarlyStopping(
    monitor='val_loss', patience=10, restore_best_weights=True
)

history = model.fit(
    X_train, y_train,
    epochs=100,
    batch_size=32,
    validation_split=0.2,
    callbacks=[early_stop],
    verbose=1
)

# Évaluation
loss, accuracy = model.evaluate(X_test, y_test)
print(f"Test Accuracy: {accuracy:.4f}")`}
          />
        </div>

        <Callout type="warning">
          Les réseaux de neurones nécessitent beaucoup de données pour bien performer.
          Pour les petits datasets (&lt; 10 000 exemples), les algorithmes classiques comme Random Forest
          ou SVM sont souvent plus performants.
        </Callout>
      </div>
    ),
  },
  {
    id: 'lstm',
    title: 'LSTM & Séries Temporelles',
    icon: <Activity className="w-5 h-5" />,
    readingTime: 3,
    content: (
      <div className="space-y-6">
        <div>
          <h3 className="text-2xl font-bold mb-4">LSTM & Séries Temporelles</h3>
          <p className="text-muted-foreground leading-relaxed">
            Les LSTM (Long Short-Term Memory) sont un type spécial de réseau de neurones récurrent (RNN)
            conçu pour résoudre le problème du <strong>vanishing gradient</strong> (gradient qui s&apos;évanouit)
            dans les séquences longues. Elles sont idéales pour les séries temporelles, le NLP, etc.
          </p>
        </div>

        <div className="bg-secondary/50 border border-border rounded-lg p-4">
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            <FileCode2 className="w-4 h-4 text-primary" /> Les 3 Portes LSTM
          </h4>
          <div className="text-sm text-muted-foreground space-y-2">
            <p><strong className="text-foreground">Forget Gate (Porte d&apos;oubli)</strong> — Décide quelles informations oublier : fₜ = σ(Wf · [hₜ₋₁, xₜ] + bf)</p>
            <p><strong className="text-foreground">Input Gate (Porte d&apos;entrée)</strong> — Décide quelles nouvelles informations stocker : iₜ = σ(Wi · [hₜ₋₁, xₜ] + bi)</p>
            <p><strong className="text-foreground">Output Gate (Porte de sortie)</strong> — Décide quelle partie de la mémoire utiliser en sortie : oₜ = σ(Wo · [hₜ₋₁, xₜ] + bo)</p>
          </div>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-2">Cas d&apos;usage</h4>
          <p className="text-muted-foreground mb-4">
            Prédiction de la consommation énergétique de bâtiments, prévision météo, prédiction du trafic,
            analyse de sentiment, traduction automatique, etc.
          </p>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-2">Implémentation Python</h4>
          <CodeBlock
            code={`import numpy as np
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout
from sklearn.preprocessing import MinMaxScaler

# Normalisation des données
scaler = MinMaxScaler(feature_range=(0, 1))
scaled_data = scaler.fit_transform(data.values)

# Création des séquences glissantes
def create_sequences(data, seq_length):
    X, y = [], []
    for i in range(seq_length, len(data)):
        X.append(data[i-seq_length:i])
        y.append(data[i])
    return np.array(X), np.array(y)

SEQ_LENGTH = 24  # 24 heures de contexte
X, y = create_sequences(scaled_data, SEQ_LENGTH)

# Division temporelle (pas aléatoire !)
split = int(len(X) * 0.8)
X_train, X_test = X[:split], X[split:]
y_train, y_test = y[:split], y[split:]

# Modèle LSTM empilé
model = Sequential([
    LSTM(128, return_sequences=True, input_shape=(SEQ_LENGTH, X.shape[2])),
    Dropout(0.2),
    LSTM(64, return_sequences=False),
    Dropout(0.2),
    Dense(32, activation='relu'),
    Dense(1)
])

model.compile(optimizer='adam', loss='mse', metrics=['mae'])

# Entraînement
history = model.fit(
    X_train, y_train,
    epochs=50,
    batch_size=32,
    validation_data=(X_test, y_test),
    shuffle=False  # Important pour les séries temporelles !
)`}
          />
        </div>

        <ProsCons
          pros={[
            'Gère les dépendances à long terme dans les séquences',
            "Résout le problème du vanishing gradient",
            "Excellent pour les séries temporelles et le NLP",
            "Peut capturer des patterns saisonniers",
          ]}
          cons={[
            "Plus lent à entraîner que les RNN simples",
            "Nombreux hyperparamètres (units, layers, seq_length...)",
            "Nécessite une normalisation soignée des données",
            "Difficile à interpréter (boîte noire)",
          ]}
        />

        <Callout type="warning">
          Important : pour les séries temporelles, ne JAMAIS faire un shuffle aléatoire lors de la division
          train/test. Il faut respecter l&apos;ordre chronologique pour éviter la fuite de données temporelle (data leakage).
        </Callout>
      </div>
    ),
  },
  {
    id: 'metriques',
    title: 'Métriques de Performance',
    icon: <BarChart3 className="w-5 h-5" />,
    readingTime: 3,
    content: (
      <div className="space-y-6">
        <div>
          <h3 className="text-2xl font-bold mb-4">Métriques de Performance</h3>
          <p className="text-muted-foreground leading-relaxed">
            Évaluer correctement un modèle est aussi important que l&apos;entraîner. Chaque métrique a ses
            avantages et inconvénients, et le choix dépend du problème et du contexte métier.
          </p>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-3">Régression</h4>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { name: 'MAE', full: 'Mean Absolute Error', formula: '(1/n) Σ|yᵢ - ŷᵢ|', desc: 'Erreur moyenne. Facile à interpréter (même unité que y).' },
              { name: 'RMSE', full: 'Root Mean Squared Error', formula: '√[(1/n) Σ(yᵢ - ŷᵢ)²]', desc: 'Pénalise plus les grandes erreurs. Très utilisée.' },
              { name: 'R² Score', full: 'Coefficient de Détermination', formula: '1 - SS_res/SS_tot', desc: 'Proportion de variance expliquée. Entre 0 et 1.' },
            ].map((m) => (
              <div key={m.name} className="bg-secondary/30 border border-border rounded-lg p-3">
                <h5 className="font-semibold text-primary-foreground">{m.name} <span className="text-muted-foreground font-normal text-xs">— {m.full}</span></h5>
                <p className="font-mono text-xs text-amber-400 my-1">{m.formula}</p>
                <p className="text-xs text-muted-foreground">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-3">Classification</h4>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { name: 'Accuracy', formula: '(TP+TN)/(TP+TN+FP+FN)', desc: 'Proportion de prédictions correctes. Attention aux classes déséquilibrées.' },
              { name: 'Precision', formula: 'TP/(TP+FP)', desc: 'Parmi les positifs prédits, combien sont réellement positifs ?' },
              { name: 'Recall', formula: 'TP/(TP+FN)', desc: 'Parmi les réels positifs, combien ont été correctement détectés ?' },
              { name: 'F1-Score', formula: '2 × (Precision × Recall)/(Precision + Recall)', desc: 'Moyenne harmonique de Precision et Recall. Bon compromis.' },
            ].map((m) => (
              <div key={m.name} className="bg-secondary/30 border border-border rounded-lg p-3">
                <h5 className="font-semibold text-primary-foreground">{m.name}</h5>
                <p className="font-mono text-xs text-amber-400 my-1">{m.formula}</p>
                <p className="text-xs text-muted-foreground">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-3">Matrice de Confusion</h4>
          <CodeBlock
            language="text"
            code={`                 Prédit Positif    Prédit Négatif
Réel Positif      TP (Vrai Pos)    FN (Faux Nég)
Réel Négatif      FP (Faux Pos)    TN (Vrai Neg)

Exemple Titanic :
                 Survécu  Non Survécu
Survécu             85        15
Non Survécu          12       78`}
          />
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-2">Code Python</h4>
          <CodeBlock
            code={`from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    confusion_matrix, classification_report, roc_auc_score
)

# Prédictions
y_pred = model.predict(X_test)

# Métriques
print(f"Accuracy:  {accuracy_score(y_test, y_pred):.4f}")
print(f"Precision: {precision_score(y_test, y_pred):.4f}")
print(f"Recall:    {recall_score(y_test, y_pred):.4f}")
print(f"F1-Score:  {f1_score(y_test, y_pred):.4f}")
print(f"ROC-AUC:   {roc_auc_score(y_test, y_pred_proba):.4f}")

# Matrice de confusion
cm = confusion_matrix(y_test, y_pred)
print(f"\\nMatrice de confusion:\\n{cm}")

# Rapport complet
print(classification_report(y_test, y_pred, target_names=['Non Survécu', 'Survécu']))`}
          />
        </div>

        <Callout type="warning">
          Dans le cas de données déséquilibrées (ex: fraude bancaire avec 0.1% de positifs),
          l&apos;accuracy peut être trompeuse. Un modèle qui prédit toujours &quot;non fraude&quot; aura
          99.9% d&apos;accuracy mais ne détectera aucune fraude ! Privilégiez le F1-Score ou le Recall.
        </Callout>
      </div>
    ),
  },
  {
    id: 'optimisation',
    title: 'Optimisation',
    icon: <Sparkles className="w-5 h-5" />,
    readingTime: 3,
    content: (
      <div className="space-y-6">
        <div>
          <h3 className="text-2xl font-bold mb-4">Optimisation & Bonnes Pratiques</h3>
          <p className="text-muted-foreground leading-relaxed">
            L&apos;optimisation d&apos;un modèle ML est l&apos;étape qui fait la différence entre un modèle moyen
            et un modèle performant. Voici les techniques essentielles.
          </p>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-3">1. Cross-Validation</h4>
          <p className="text-muted-foreground mb-4">
            La validation croisée permet d&apos;évaluer la performance du modèle de manière plus fiable
            que la simple division train/test.
          </p>
          <CodeBlock
            code={`from sklearn.model_selection import cross_val_score, KFold, StratifiedKFold

# K-Fold Cross Validation
kf = KFold(n_splits=5, shuffle=True, random_state=42)
scores = cross_val_score(model, X, y, cv=kf, scoring='accuracy')
print(f"CV Accuracy: {scores.mean():.4f} (±{scores.std():.4f})")

# Stratified K-Fold (pour classes déséquilibrées)
skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
scores = cross_val_score(model, X, y, cv=skf, scoring='f1')`}
          />
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-3">2. Grid Search</h4>
          <CodeBlock
            code={`from sklearn.model_selection import GridSearchCV, RandomizedSearchCV

# Grid Search exhaustif
param_grid = {
    'n_estimators': [100, 200, 500],
    'max_depth': [5, 10, 20, None],
    'min_samples_split': [2, 5, 10],
}

grid = GridSearchCV(
    RandomForestClassifier(random_state=42),
    param_grid,
    cv=5,
    scoring='f1',
    n_jobs=-1,  # Utilise tous les cœurs CPU
    verbose=1
)
grid.fit(X_train, y_train)
print(f"Best params: {grid.best_params_}")
print(f"Best score: {grid.best_score_:.4f}")`}
          />
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-3">3. Régularisation (L1 / L2)</h4>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <h5 className="text-blue-400 font-semibold mb-2">L1 (Lasso)</h5>
              <p className="text-sm text-muted-foreground">
                Ajoute |w| à la loss. Peut mettre certains poids à 0 → sélection automatique de features.
                <br /><strong className="text-foreground">Formule :</strong> Loss + λΣ|wᵢ|
              </p>
            </div>
            <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
              <h5 className="text-purple-400 font-semibold mb-2">L2 (Ridge)</h5>
              <p className="text-sm text-muted-foreground">
                Ajoute w² à la loss. Réduit les poids sans les annuler. Prévient le surapprentissage.
                <br /><strong className="text-foreground">Formule :</strong> Loss + λΣwᵢ²
              </p>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-3">4. Early Stopping</h4>
          <p className="text-muted-foreground mb-4">
            Arrête l&apos;entraînement quand la performance sur le jeu de validation cesse de s&apos;améliorer.
            Évite le surapprentissage et fait gagner du temps.
          </p>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-3">5. Dropout</h4>
          <p className="text-muted-foreground mb-4">
            Technique de régularisation pour les réseaux de neurones. Pendant l&apos;entraînement,
            désactive aléatoirement une proportion de neurones à chaque itération.
            Cela force le réseau à ne pas dépendre d&apos;un seul neurone.
          </p>
          <CodeBlock
            code={`from tensorflow.keras.layers import Dropout

model = keras.Sequential([
    layers.Dense(256, activation='relu', input_shape=(input_dim,)),
    layers.Dropout(0.5),   # 50% des neurones désactivés
    layers.Dense(128, activation='relu'),
    layers.Dropout(0.3),   # 30% des neurones désactivés
    layers.Dense(1, activation='sigmoid')
])`}
          />
        </div>

        <Callout type="tip">
          Bonne pratique : commencez toujours par un modèle simple (baseline), puis ajoutez de la complexité
          progressivement. Mesurez l&apos;impact de chaque changement avec la cross-validation.
          Ne jamais optimiser directement sur le jeu de test — il doit rester &quot;inviolé&quot; jusqu&apos;à l&apos;évaluation finale.
        </Callout>
      </div>
    ),
  },
];

// ─── Quiz Data ──────────────────────────────────────────────────────
interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

const quizData: Record<string, QuizQuestion[]> = {
  intro: [
    {
      question: "Quels sont les 3 types d'apprentissage en Machine Learning ?",
      options: ['Supervisé, Non Supervisé, Par Renforcement', 'Linéaire, Non-linéaire, Hybride', 'Classique, Moderne, Avancé', 'Statistique, Probabiliste, Déterministe'],
      correctIndex: 0,
    },
    {
      question: 'Quel est le but principal du Machine Learning ?',
      options: ['Apprendre à partir de données sans être explicitement programmé', 'Programmer manuellement des règles', 'Créer des bases de données', 'Optimiser la vitesse de calcul'],
      correctIndex: 0,
    },
    {
      question: 'Quelle est la première étape du pipeline ML ?',
      options: ['Entraînement du modèle', 'Évaluation', 'Déploiement', 'Collecte des données'],
      correctIndex: 3,
    },
  ],
  regression: [
    {
      question: 'Que modélise la régression linéaire ?',
      options: ['Une courbe exponentielle', 'Une distribution normale', 'Un arbre de décision', 'Une relation linéaire entre variables'],
      correctIndex: 3,
    },
    {
      question: 'Quelle est la fonction de perte utilisée en régression linéaire ?',
      options: ['Cross-entropy', 'Hinge Loss', 'MSE (Mean Squared Error)', 'Focal Loss'],
      correctIndex: 2,
    },
    {
      question: 'La régression linéaire est sensible aux :',
      options: ['Données manquantes', 'Données catégorielles', 'Outliers (valeurs aberrantes)', 'Données temporelles'],
      correctIndex: 2,
    },
  ],
  logistique: [
    {
      question: "Malgré son nom, la régression logistique est utilisée pour :",
      options: ['La prédiction de valeurs continues', 'Le clustering', 'La réduction de dimension', 'La classification (binaire ou multiclasse)'],
      correctIndex: 3,
    },
    {
      question: 'Quelle fonction transforme la sortie en probabilité entre 0 et 1 ?',
      options: ['ReLU', 'Tanh', 'Fonction Sigmoïde', 'Softmax'],
      correctIndex: 2,
    },
    {
      question: 'Si σ(z) ≥ 0.5, le modèle prédit :',
      options: ['Une incertitude', 'La classe 1', 'Une valeur de régression', 'La classe 0'],
      correctIndex: 1,
    },
  ],
  metriques: [
    {
      question: 'Dans un cas de classes déséquilibrées (ex: fraude), quelle métrique est recommandée ?',
      options: ['Accuracy', 'F1-Score ou Recall', 'R² Score', 'MAE'],
      correctIndex: 1,
    },
    {
      question: 'Que mesure la métrique Precision ?',
      options: ['La proportion de vrais positifs parmi les prédictions positives', 'La proportion de vrais positifs parmi les réels positifs', 'La moyenne des erreurs', 'Le taux de bonnes prédictions global'],
      correctIndex: 0,
    },
    {
      question: 'Le F1-Score est la moyenne harmonique de :',
      options: ['Accuracy et Recall', 'TP et TN', 'Precision et Recall', 'Precision et Accuracy'],
      correctIndex: 2,
    },
  ],
  randomforest: [
    {
      question: "Quelle technique d'ensemble est à la base du Random Forest ?",
      options: ['Boosting séquentiel', 'Bagging (Bootstrap Aggregating)', 'Stacking de modèles', 'Voting pondéré'],
      correctIndex: 1,
    },
    {
      question: "Comment le Random Forest réduit-il le surapprentissage par rapport à un arbre unique ?",
      options: ['En limitant la profondeur maximale à 2', 'En entraînant plusieurs arbres sur des sous-échantillons et en moyennant leurs prédictions', 'En supprimant les variables corrélées', 'En utilisant uniquement des variables continues'],
      correctIndex: 1,
    },
    {
      question: "Quel hyperparamètre contrôle le nombre d'arbres dans un Random Forest ?",
      options: ['max_depth', 'learning_rate', 'n_estimators', 'min_samples_split'],
      correctIndex: 2,
    },
  ],
  neural: [
    {
      question: "Quelle fonction d'activation est recommandée pour les couches cachées d'un réseau de neurones profond ?",
      options: ['Sigmoïde', 'Tanh', 'ReLU (Rectified Linear Unit)', 'Softmax'],
      correctIndex: 2,
    },
    {
      question: "Quel est le rôle du Dropout dans un réseau de neurones ?",
      options: ['Accélérer la phase de propagation avant', 'Désactiver aléatoirement des neurones pendant l\'entraînement pour réduire le surapprentissage', 'Augmenter la taille du batch', 'Réduire le nombre de couches'],
      correctIndex: 1,
    },
    {
      question: "L'algorithme de rétropropagation (backpropagation) utilise quelle méthode pour calculer les gradients ?",
      options: ['Dérivées premières et règle de chaîne (chain rule)', 'Méthode de Monte Carlo', 'Dérivées secondes uniquement', 'Différences finies'],
      correctIndex: 0,
    },
  ],
  lstm: [
    {
      question: "Quel problème majeur des RNN classiques le LSTM résout-il ?",
      options: ['Le surapprentissage (overfitting)', 'La disparition du gradient (vanishing gradient)', 'Le manque de données d\'entraînement', 'L\'impossibilité de traiter des images'],
      correctIndex: 1,
    },
    {
      question: "Combien de portes (gates) un bloc LSTM standard possède-t-il ?",
      options: ['2 (entrée et sortie)', '3 (oubli, entrée, sortie)', '4 (oubli, entrée, candidat, sortie)', '1 (mise à jour globale)'],
      correctIndex: 2,
    },
    {
      question: "Dans un LSTM, à quoi sert la porte d'oubli (forget gate) ?",
      options: ['À supprimer des neurones du réseau', 'À décider quelles informations de la cellule mémoire doivent être conservées ou oubliées', 'À ignorer les premières séquences temporelles', 'À réinitialiser les poids du modèle'],
      correctIndex: 1,
    },
  ],
  optimisation: [
    {
      question: "Quel est le but principal de la validation croisée (cross-validation) ?",
      options: ['Augmenter la taille du jeu de données', 'Évaluer la capacité de généralisation d\'un modèle de manière plus fiable', 'Accélérer l\'entraînement du modèle', 'Supprimer les variables corrélées'],
      correctIndex: 1,
    },
    {
      question: "À quoi sert la régularisation L2 (Ridge) dans un modèle ?",
      options: ['Sélectionner automatiquement les variables pertinentes', 'Pénaliser les grands coefficients pour réduire le surapprentissage', 'Augmenter la complexité du modèle', 'Éliminer les valeurs aberrantes'],
      correctIndex: 1,
    },
    {
      question: "L'early stopping consiste à :",
      options: ['Arrêter l\'entraînement quand la performance sur le jeu de validation cesse de s\'améliorer', 'Réduire le learning rate à chaque epoch', 'Arrêter après un nombre fixe d\'itérations', 'Supprimer les premiers neurones du réseau'],
      correctIndex: 0,
    },
  ],
};

// ─── Glossary Data ──────────────────────────────────────────────────
interface GlossaryEntry {
  term: string;
  definition: string;
  category: string;
}

const glossaryData: GlossaryEntry[] = [
  // Fondamentaux
  { term: 'Overfitting (Surapprentissage)', definition: "Situation où un modèle apprend trop bien les données d'entraînement et généralise mal sur de nouvelles données.", category: 'Fondamentaux' },
  { term: 'Underfitting (Sous-apprentissage)', definition: "Un modèle trop simple qui ne capture pas les patterns des données d'entraînement.", category: 'Fondamentaux' },
  { term: 'Biais (Bias)', definition: 'Erreur systématique due à des hypothèses simplificatrices du modèle. Un biais élevé cause de l\'underfitting.', category: 'Fondamentaux' },
  { term: 'Variance', definition: 'Sensibilité du modèle aux fluctuations des données d\'entraînement. Une variance élevée cause de l\'overfitting.', category: 'Fondamentaux' },
  { term: 'Feature Engineering', definition: 'Processus de création de nouvelles variables (features) à partir des données brutes pour améliorer les performances du modèle.', category: 'Fondamentaux' },
  // Algorithmes
  { term: 'Régression Linéaire', definition: 'Algorithme qui modélise une relation linéaire entre une variable cible et une ou plusieurs variables explicatives.', category: 'Algorithmes' },
  { term: 'Random Forest', definition: 'Algorithme d\'ensemble qui combine plusieurs arbres de décision entraînés sur des sous-ensembles aléatoires (bagging).', category: 'Algorithmes' },
  { term: 'K-Means', definition: 'Algorithme de clustering non supervisé qui partitionne les données en K groupes en minimisant la distance intra-cluster.', category: 'Algorithmes' },
  { term: 'SVM (Support Vector Machine)', definition: 'Algorithme de classification qui trouve l\'hyperplan optimal maximisant la marge entre les classes.', category: 'Algorithmes' },
  { term: 'Gradient Boosting', definition: 'Technique d\'ensemble qui construit séquentiellement des modèles faibles, chacun corrigeant les erreurs du précédent (XGBoost, LightGBM).', category: 'Algorithmes' },
  // Métriques
  { term: 'Accuracy (Précision globale)', definition: 'Proportion de prédictions correctes. Attention : trompeuse en cas de classes déséquilibrées.', category: 'Métriques' },
  { term: 'F1-Score', definition: 'Moyenne harmonique de la Precision et du Recall. Bon compromis pour les datasets déséquilibrés.', category: 'Métriques' },
  { term: 'Precision', definition: 'Parmi les prédictions positives, combien sont réellement positives ? Important quand les faux positifs sont coûteux.', category: 'Métriques' },
  { term: 'Recall (Rappel)', definition: 'Parmi les cas réellement positifs, combien ont été détectés ? Important quand les faux négatifs sont coûteux.', category: 'Métriques' },
  { term: 'ROC-AUC', definition: 'Aire sous la courbe ROC. Mesure la capacité du modèle à distinguer entre les classes, indépendamment du seuil.', category: 'Métriques' },
  // Deep Learning
  { term: 'Réseau de Neurones', definition: 'Modèle inspiré du cerveau composé de couches de neurones interconnectés. Base du Deep Learning.', category: 'Deep Learning' },
  { term: 'LSTM', definition: 'Long Short-Term Memory. Type de RNN avec des portes (forget, input, output) pour gérer les dépendances à long terme.', category: 'Deep Learning' },
  { term: 'Dropout', definition: 'Technique de régularisation qui désactive aléatoirement une proportion de neurones pendant l\'entraînement pour prévenir le surapprentissage.', category: 'Deep Learning' },
  { term: 'Backpropagation', definition: 'Algorithme pour calculer les gradients des poids d\'un réseau de neurones en propageant l\'erreur de la sortie vers l\'entrée.', category: 'Deep Learning' },
  { term: 'Transfer Learning', definition: 'Technique consistant à réutiliser un modèle pré-entraîné sur une grande tâche comme point de départ pour une tâche similaire plus spécifique.', category: 'Deep Learning' },
  // Données
  { term: 'Dataset', definition: 'Ensemble de données utilisé pour entraîner et évaluer un modèle ML. Se divise généralement en train, validation et test.', category: 'Données' },
  { term: 'Normalisation', definition: 'Mise à l\'échelle des features (ex: MinMaxScaler, StandardScaler) pour que le modèle ne soit pas biaisé par les grandeurs différentes.', category: 'Données' },
  { term: 'Data Leakage', definition: "Fuite de données : contamination accidentelle du jeu d'entraînement par des informations du jeu de test, menant à une évaluation trop optimiste.", category: 'Données' },
  { term: 'Cross-Validation', definition: "Technique d'évaluation qui divise les données en K folds (plis) et entraîne/évalue K fois pour obtenir une estimation fiable de la performance.", category: 'Données' },
];

const glossaryCategories = ['Fondamentaux', 'Algorithmes', 'Métriques', 'Deep Learning', 'Données'];

// ─── ML Formulas Cheatsheet Data ──────────────────────────────────────
interface FormulaCard {
  title: string;
  emoji: string;
  formula: string;
  description: string;
  category: 'Régression' | 'Classification' | 'Optimisation' | 'Deep Learning' | 'Métriques';
}

const formulaIconMap: Record<string, React.ReactNode> = {
  TrendingUp: <TrendingUp className="w-5 h-5 text-emerald-400" />,
  Target: <Target className="w-5 h-5 text-purple-400" />,
  BarChart3: <BarChart3 className="w-5 h-5 text-amber-400" />,
  ArrowDown: <ArrowDown className="w-5 h-5 text-cyan-400" />,
  Scale: <Scale className="w-5 h-5 text-rose-400" />,
  Ruler: <Ruler className="w-5 h-5 text-blue-400" />,
  Dice5: <Dice5 className="w-5 h-5 text-primary-foreground" />,
  Brain: <Brain className="w-5 h-5 text-primary-foreground" />,
  RefreshCw: <RefreshCw className="w-5 h-5 text-primary-foreground" />,
  Search: <Search className="w-5 h-5 text-primary-foreground" />,
};

function FormulaIcon({ name }: { name: string }) {
  return <span className="text-xl">{formulaIconMap[name] || <Brain className="w-5 h-5 text-muted-foreground" />}</span>;
}

const formulaCardsData: FormulaCard[] = [
  {
    title: 'Régression Linéaire',
    emoji: 'TrendingUp',
    formula: 'y = wx + b',
    description: 'Modélise une relation linéaire entre les features et la cible. Loss : MSE = (1/n) Σ(yᵢ - ŷᵢ)²',
    category: 'Régression',
  },
  {
    title: 'Régression Logistique',
    emoji: 'Target',
    formula: 'σ(z) = 1/(1+e⁻ᶻ)',
    description: 'Transforme une valeur linéaire en probabilité [0,1]. Loss : Cross-Entropy = -Σ[yᵢ·log(ŷᵢ) + (1-yᵢ)·log(1-ŷᵢ)]',
    category: 'Classification',
  },
  {
    title: 'Softmax',
    emoji: 'BarChart3',
    formula: 'softmax(zᵢ) = eᶻⁱ / Σeᶻʲ',
    description: 'Généralise la sigmoïde en multi-classes. Convertit un vecteur de scores en distribution de probabilités.',
    category: 'Classification',
  },
  {
    title: 'Gradient Descent',
    emoji: 'ArrowDown',
    formula: 'w = w - α·∂L/∂w',
    description: 'Met à jour les poids en suivant la direction opposée du gradient. α est le taux d\'apprentissage (learning rate).',
    category: 'Optimisation',
  },
  {
    title: 'F1-Score',
    emoji: 'Scale',
    formula: 'F1 = 2·(P·R)/(P+R)',
    description: 'Moyenne harmonique de la Precision (P) et du Recall (R). Idéal pour les datasets déséquilibrés.',
    category: 'Métriques',
  },
  {
    title: 'R² Score',
    emoji: 'Ruler',
    formula: 'R² = 1 - SS_res/SS_tot',
    description: 'Mesure la proportion de variance expliquée par le modèle. 1 = prédiction parfaite, 0 = prédiction comme la moyenne.',
    category: 'Métriques',
  },
  {
    title: 'Dropout',
    emoji: 'Dice5',
    formula: 'output = mask * input / (1 - p)',
    description: 'Régularisation qui désactive aléatoirement des neurones pendant l\'entraînement. L\'inverse scaling maintient l\'espérance.',
    category: 'Deep Learning',
  },
  {
    title: 'LSTM Forget Gate',
    emoji: 'Brain',
    formula: 'fₜ = σ(Wf·[hₜ₋₁,xₜ] + bf)',
    description: 'Porte d\'oubli du LSTM. Détermine quelles informations de la mémoire précédente conserver ou oublier.',
    category: 'Deep Learning',
  },
  {
    title: 'Batch Normalization',
    emoji: 'RefreshCw',
    formula: 'x̂ = (x - μ) / √(σ² + ε)',
    description: 'Normalise les activations par mini-batch. Accélère l\'entraînement et réduit la sensibilité à l\'initialisation.',
    category: 'Deep Learning',
  },
  {
    title: 'Attention',
    emoji: 'Search',
    formula: 'Attention(Q,K,V) = softmax(QKᵀ/√dₖ)V',
    description: 'Mécanisme clé des Transformers. Calcule l\'importance relative de chaque élément de la séquence via Q, K, V.',
    category: 'Deep Learning',
  },
];

const formulaCategories: FormulaCard['category'][] = ['Régression', 'Classification', 'Optimisation', 'Deep Learning', 'Métriques'];
const formulaCategoryColors: Record<FormulaCard['category'], string> = {
  'Régression': 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  'Classification': 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  'Optimisation': 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  'Deep Learning': 'text-primary-foreground bg-primary/10 border-primary/20',
  'Métriques': 'text-rose-400 bg-rose-500/10 border-rose-500/20',
};

// ─── Tips Data (Astuce du Jour) ────────────────────────────────
type TipCategory = 'Fondamentaux' | 'Pratique' | 'Carrière' | 'Outils';
interface TipData {
  text: string;
  category: TipCategory;
  icon: string;
}

const tipsData: TipData[] = [
  { text: 'Commencez toujours par un modèle simple (régression linéaire) avant d\'essayer des modèles complexes. C\'est votre baseline.', category: 'Fondamentaux', icon: '' },
  { text: 'La validation croisée (cross-validation) est plus fiable qu\'une simple division train/test pour évaluer votre modèle.', category: 'Pratique', icon: '' },
  { text: 'Normalisez vos données numériques avant d\'entraîner un modèle sensible aux échelles (SVM, KNN, réseaux de neurones).', category: 'Pratique', icon: '' },
  { text: 'Le feature engineering représente souvent 80% du travail en ML. De bonnes features valent mieux qu\'un modèle complexe.', category: 'Fondamentaux', icon: '' },
  { text: 'Surveillez toujours le surapprentissage (overfitting) : si votre modèle performe beaucoup mieux en train qu\'en test, c\'est suspect.', category: 'Fondamentaux', icon: '' },
  { text: 'Pour les données déséquilibrées, utilisez le F1-Score plutôt que l\'accuracy pour évaluer votre modèle.', category: 'Pratique', icon: '' },
  { text: 'Git est votre meilleur ami : versionnez vos notebooks, expériences et datasets. Vous ne le regretterez jamais.', category: 'Outils', icon: '' },
  { text: 'Les data scientists passent environ 60-80% de leur temps sur le nettoyage et la préparation des données.', category: 'Carrière', icon: '' },
  { text: 'Utilisez les pipelines scikit-learn (Pipeline) pour éviter la fuite de données lors du preprocessing.', category: 'Pratique', icon: '' },
  { text: 'Un modèle interprétable est souvent préféré en production. La confiance des utilisateurs compte autant que la performance.', category: 'Carrière', icon: '' },
  { text: 'Commencez votre projet ML par une analyse exploratoire approfondie (EDA). Vos données ont beaucoup à vous dire.', category: 'Pratique', icon: '' },
  { text: 'Le Random Forest est souvent le meilleur choix « out-of-the-box » pour les datasets tabulaires.', category: 'Fondamentaux', icon: '' },
  { text: 'Apprenez à lire une matrice de confusion : elle révèle bien plus que l\'accuracy seule sur les erreurs de votre modèle.', category: 'Fondamentaux', icon: '' },
  { text: 'Documentez vos expériences ML : hyperparamètres testés, résultats obtenus, insights découverts.', category: 'Carrière', icon: '' },
  { text: 'Jupyter Notebooks + Google Colab = combinaison parfaite pour prototyper rapidement sans configuration.', category: 'Outils', icon: '' },
  { text: 'Le biais-variance tradeoff est fondamental : un bon modèle trouve le juste milieu entre sous-apprentissage et surapprentissage.', category: 'Fondamentaux', icon: '' },
  { text: 'Pour les séries temporelles, ne mélangez jamais les données temporelles lors de la division train/test !', category: 'Pratique', icon: '' },
  { text: 'Participez à des compétitions Kaggle pour vous entraîner et apprendre des techniques avancées.', category: 'Carrière', icon: '' },
  { text: 'L\'early stopping est l\'un des moyens les plus efficaces de prévenir le surapprentissage des réseaux de neurones.', category: 'Pratique', icon: '' },
  { text: 'SVM avec kernel RBF peut capturer des frontières de décision très complexes, mais nécessite un bon tuning des hyperparamètres.', category: 'Fondamentaux', icon: '' },
  { text: 'Les valeurs manquantes sont informatives. Le fait qu\'une valeur soit manquante peut être une feature à part entière.', category: 'Pratique', icon: '' },
  { text: 'MLflow ou Weights & Biases sont indispensables pour tracker vos expériences en ML.', category: 'Outils', icon: '' },
  { text: 'La communication des résultats est aussi importante que le modèle lui-même. Apprenez à vulgariser vos résultats.', category: 'Carrière', icon: '' },
  { text: 'L\'imputation par la médiane est plus robuste que l\'imputation par la moyenne pour les données asymétriques (skewed).', category: 'Pratique', icon: '' },
  { text: 'Un apprentissage continu est essentiel en ML : les techniques évoluent très rapidement. Lisez des papers et des blogs régulièrement.', category: 'Carrière', icon: '' },
  { text: 'Testez plusieurs algorithmes avant d\'en choisir un. Il n\'existe pas de modèle universel pour tous les problèmes (No Free Lunch).', category: 'Fondamentaux', icon: '' },
  { text: 'L\'encodage one-hot est préféré pour les variables catégorielles nominales, tandis que le label encoding convient aux variables ordinales.', category: 'Pratique', icon: '' },
  { text: 'Docker est un outil incontournable pour déployer vos modèles ML de manière reproductible.', category: 'Outils', icon: '' },
  { text: 'Les réseaux de neurones ne sont pas toujours la meilleure solution. Pour les petits datasets, les méthodes classiques sont souvent supérieures.', category: 'Fondamentaux', icon: '' },
];

const tipCategoryColors: Record<TipCategory, string> = {
  'Fondamentaux': 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  'Pratique': 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  'Carrière': 'bg-purple-500/15 text-purple-400 border-purple-500/30',
  'Outils': 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
};

// ─── Daily Challenge Data (Challenge du Jour) ─────────────────────
type ChallengeDifficulty = 'Facile' | 'Moyen' | 'Difficile';
interface DailyChallenge {
  title: string;
  description: string;
  difficulty: ChallengeDifficulty;
  relatedChapter: CourseSectionId;
  chapterLabel: string;
  estimatedTime: string;
}

const dailyChallenges: DailyChallenge[] = [
  { title: 'Implémentez une régression linéaire de zéro avec numpy', description: 'Créez une fonction de régression linéaire (loss, gradient, descente de gradient) sans utiliser scikit-learn. Visualisez la convergence de la loss.', difficulty: 'Facile', relatedChapter: 'regression', chapterLabel: 'Régression Linéaire', estimatedTime: '30 min' },
  { title: 'Créez un dataset synthétique avec make_classification', description: 'Utilisez sklearn.datasets.make_classification pour générer un dataset avec 1000 échantillons, 20 features (5 informatives). Explorez les corrélations.', difficulty: 'Facile', relatedChapter: 'intro', chapterLabel: 'Introduction au ML', estimatedTime: '20 min' },
  { title: 'Construisez un pipeline de preprocessing complet', description: 'Créez un pipeline scikit-learn avec imputation, standardisation et encodage. Appliquez-le sur un dataset réel avec des valeurs manquantes et des variables catégorielles.', difficulty: 'Moyen', relatedChapter: 'intro', chapterLabel: 'Introduction au ML', estimatedTime: '45 min' },
  { title: 'Implémentez la régression logistique avec descente de gradient', description: 'Codez la sigmoïde, la log-loss et la descente de gradient pour la régression logistique binaire. Comparez avec scikit-learn sur un dataset de votre choix.', difficulty: 'Moyen', relatedChapter: 'logistique', chapterLabel: 'Régression Logistique', estimatedTime: '40 min' },
  { title: 'Analysez les performances avec une matrice de confusion custom', description: 'Implémentez votre propre matrice de confusion, calculez precision, recall, F1-score à la main. Visualisez avec seaborn.heatmap.', difficulty: 'Moyen', relatedChapter: 'metriques', chapterLabel: 'Métriques d\'Évaluation', estimatedTime: '35 min' },
  { title: 'Entraînez un Random Forest et analysez l\'importance des features', description: 'Utilisez RandomForestClassifier sur un dataset tabulaire. Extrayez feature_importances_, visualisez avec un bar chart horizontal. Identifiez les features les plus importantes.', difficulty: 'Moyen', relatedChapter: 'randomforest', chapterLabel: 'Random Forest', estimatedTime: '30 min' },
  { title: 'Créez un réseau de neurones pour la classification d\'images MNIST', description: 'Construisez un MLP avec Keras/TensorFlow pour classifier les chiffres MNIST. Optimisez l\'architecture (couches, neurones, dropout) pour dépasser 97% d\'accuracy.', difficulty: 'Difficile', relatedChapter: 'neural', chapterLabel: 'Réseaux de Neurones', estimatedTime: '60 min' },
  { title: 'Implémentez une cellule LSTM from scratch', description: 'Codez les 4 portes (forget, input, cell, output) d\'une cellule LSTM en numpy. Testez sur une séquence simple pour comprendre les mécanismes internes.', difficulty: 'Difficile', relatedChapter: 'lstm', chapterLabel: 'Réseaux LSTM', estimatedTime: '90 min' },
  { title: 'Implémentez la validation croisée k-fold manuellement', description: 'Codez votre propre k-fold cross-validation (k=5). Comparez les performances de 3 algorithmes sur le même dataset avec des box plots des scores.', difficulty: 'Moyen', relatedChapter: 'optimisation', chapterLabel: 'Optimisation', estimatedTime: '40 min' },
  { title: 'Créez un système de recommandation avec filtrage collaboratif', description: 'Implémentez un système de recommandation basé sur la similarité cosinus entre utilisateurs. Testez sur le dataset MovieLens et évaluez avec RMSE.', difficulty: 'Difficile', relatedChapter: 'metriques', chapterLabel: 'Métriques d\'Évaluation', estimatedTime: '75 min' },
];

const challengeDifficultyColors: Record<ChallengeDifficulty, string> = {
  'Facile': 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  'Moyen': 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  'Difficile': 'bg-red-500/15 text-red-400 border-red-500/30',
};

// ─── Algorithm Comparison Data ──────────────────────────────────
interface AlgorithmComparison {
  name: string;
  type: string;
  complexity: string;
  interpretability: string;
  speed: string;
  dataNeeded: string;
  nonlinear: boolean;
  category: string;
}

const algorithmComparison: AlgorithmComparison[] = [
  { name: 'Régression Linéaire', type: 'Régression', complexity: '1/5', interpretability: '5/5', speed: '5/5', dataNeeded: 'Petit', nonlinear: false, category: 'Régression' },
  { name: 'Régression Logistique', type: 'Classification', complexity: '2/5', interpretability: '4/5', speed: '5/5', dataNeeded: 'Petit', nonlinear: false, category: 'Classification' },
  { name: 'SVM', type: 'Classification/Régression', complexity: '3/5', interpretability: '2/5', speed: '3/5', dataNeeded: 'Moyen', nonlinear: true, category: 'Classification' },
  { name: 'Random Forest', type: 'Classification/Régression', complexity: '3/5', interpretability: '3/5', speed: '3/5', dataNeeded: 'Moyen', nonlinear: true, category: 'Ensemble' },
  { name: 'KNN', type: 'Classification/Régression', complexity: '1/5', interpretability: '4/5', speed: '2/5', dataNeeded: 'Moyen', nonlinear: true, category: 'Classification' },
  { name: 'XGBoost', type: 'Classification/Régression', complexity: '4/5', interpretability: '2/5', speed: '3/5', dataNeeded: 'Moyen', nonlinear: true, category: 'Ensemble' },
  { name: 'Réseau de Neurones', type: 'Classification/Régression', complexity: '5/5', interpretability: '1/5', speed: '2/5', dataNeeded: 'Grand', nonlinear: true, category: 'Deep Learning' },
  { name: 'LSTM', type: 'Séries Temporelles', complexity: '5/5', interpretability: '1/5', speed: '1/5', dataNeeded: 'Grand', nonlinear: true, category: 'Deep Learning' },
];

const algoCategoryColors: Record<string, string> = {
  'Régression': 'text-emerald-400',
  'Classification': 'text-purple-400',
  'Ensemble': 'text-amber-400',
  'Deep Learning': 'text-cyan-400',
};

// ─── ML Algorithm Comparison Data (Enhanced) ──────────────────────
interface MLAlgorithmCompare {
  name: string;
  type: string;
  typeBadge: 'Classification' | 'Régression' | 'Temporel';
  complexity: 'Facile' | 'Moyen' | 'Élevé';
  dataNeeded: string;
  forces: string[];
  faiblesses: string[];
}

const mlAlgorithmCompare: MLAlgorithmCompare[] = [
  {
    name: 'Régression Linéaire',
    type: 'Régression',
    typeBadge: 'Régression',
    complexity: 'Facile',
    dataNeeded: 'Petit',
    forces: ['Simple à implémenter', 'Rapide à entraîner', 'Interprétable', 'Relations linéaires'],
    faiblesses: ['Relations non-linéaires', 'Sensible aux outliers', 'Sous-apprentissage'],
  },
  {
    name: 'Régression Logistique',
    type: 'Classification binaire',
    typeBadge: 'Classification',
    complexity: 'Facile',
    dataNeeded: 'Petit',
    forces: ['Probabiliste', 'Baseline solide', 'Efficace', 'Régularisation'],
    faiblesses: ['Frontière linéaire', 'Non-linéarité', 'Encodage nécessaire'],
  },
  {
    name: 'Random Forest',
    type: 'Ensemble (Bagging)',
    typeBadge: 'Classification',
    complexity: 'Moyen',
    dataNeeded: 'Moyen',
    forces: ['Robuste', 'Feature importance', 'Non-linéaire', 'Anti-surapprentissage'],
    faiblesses: ['Moins interprétable', 'Consomme mémoire', 'Plus lent', 'Features corrélées'],
  },
  {
    name: 'KNN',
    type: 'Instance-based',
    typeBadge: 'Classification',
    complexity: 'Facile',
    dataNeeded: 'Moyen',
    forces: ['Simple', 'Instance-based', 'Non-paramétrique', 'Pas d\'entraînement'],
    faiblesses: ['Lent en prédiction', 'Curse of dimensionality', 'Sensible au scaling', 'Mémoire'],
  },
  {
    name: 'Réseaux de Neurones',
    type: 'Deep Learning',
    typeBadge: 'Classification',
    complexity: 'Élevé',
    dataNeeded: 'Grand',
    forces: ['Puissant', 'Flexible', 'Deep Learning', 'Non-linéaire'],
    faiblesses: ['Boîte noire', 'Beaucoup de données', 'Tuning complexe', 'Surapprentissage'],
  },
  {
    name: 'LSTM',
    type: 'Séries temporelles',
    typeBadge: 'Temporel',
    complexity: 'Élevé',
    dataNeeded: 'Grand',
    forces: ['Séries temporelles', 'Long terme', 'Sequential', 'Saisonnier'],
    faiblesses: ['Lent', 'Complexité', 'Normalisation', 'Interprétabilité'],
  },
];

const typeBadgeColors: Record<string, string> = {
  'Classification': 'bg-rose-500/15 text-rose-400 border-rose-500/25',
  'Régression': 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
  'Temporel': 'bg-purple-500/15 text-purple-400 border-purple-500/25',
};

const complexityColors: Record<string, string> = {
  'Facile': 'text-emerald-400',
  'Moyen': 'text-amber-400',
  'Élevé': 'text-red-400',
};

const complexityBg: Record<string, string> = {
  'Facile': 'bg-emerald-500/10',
  'Moyen': 'bg-amber-500/10',
  'Élevé': 'bg-red-500/10',
};

// ─── Resources Data ──────────────────────────────────────────────
interface ResourceEntry {
  name: string;
  description: string;
  url: string;
  icon: string;
  category: string;
}

const resourcesData: ResourceEntry[] = [
  // Bibliothèques Python
  { name: 'Scikit-learn', description: 'Bibliothèque standard pour le Machine Learning en Python', url: 'https://scikit-learn.org', icon: 'SK', category: 'Bibliothèques Python' },
  { name: 'TensorFlow', description: 'Framework open-source de Deep Learning par Google', url: 'https://tensorflow.org', icon: 'TF', category: 'Bibliothèques Python' },
  { name: 'PyTorch', description: 'Framework de Deep Learning flexible par Meta', url: 'https://pytorch.org', icon: 'PT', category: 'Bibliothèques Python' },
  { name: 'Pandas', description: 'Manipulation et analyse de données en Python', url: 'https://pandas.pydata.org', icon: 'PD', category: 'Bibliothèques Python' },
  // Outils de Visualisation
  { name: 'Matplotlib', description: 'Visualisation de données en Python', url: 'https://matplotlib.org', icon: 'MP', category: 'Outils de Visualisation' },
  { name: 'Seaborn', description: 'Visualisation statistique basée sur Matplotlib', url: 'https://seaborn.pydata.org', icon: 'SB', category: 'Outils de Visualisation' },
  { name: 'Streamlit', description: 'Création d\'applications web de data science', url: 'https://streamlit.io', icon: 'ST', category: 'Outils de Visualisation' },
  // Plateformes d\'Apprentissage
  { name: 'Colab Notebooks', description: 'Environnement de développement Jupyter gratuit par Google', url: 'https://colab.research.google.com', icon: 'CN', category: 'Plateformes d\'Apprentissage' },
  { name: 'HuggingFace', description: 'Hub de modèles, datasets et espaces ML', url: 'https://huggingface.co', icon: 'HF', category: 'Plateformes d\'Apprentissage' },
  { name: 'Kaggle', description: 'Plateforme de compétitions ML et datasets', url: 'https://kaggle.com', icon: 'KG', category: 'Datasets' },
  { name: 'UCI ML Repository', description: 'Référentiel de datasets pour le Machine Learning', url: 'https://archive.ics.uci.edu/ml', icon: 'UC', category: 'Datasets' },
  { name: 'Google Dataset Search', description: 'Moteur de recherche de datasets par Google', url: 'https://datasetsearch.research.google.com', icon: 'GS', category: 'Datasets' },
];

const resourceCategories = ['Bibliothèques Python', 'Outils de Visualisation', 'Plateformes d\'Apprentissage', 'Datasets'];

// ─── Announcements Data ────────────────────────────────────────────
interface Announcement {
  id: string;
  title: string;
  description: string;
  date: string;
  type: 'feature' | 'content' | 'event';
}

const announcementsData: Announcement[] = [
  {
    id: '1',
    title: 'Quiz pour tous les chapitres',
    description: 'Désormais, chaque chapitre dispose de 3 questions de quiz pour tester vos connaissances.',
    date: '2026-04-01',
    type: 'feature',
  },
  {
    id: '2',
    title: 'Glossaire ML enrichi',
    description: '24 termes essentiels du Machine Learning expliqués avec des exemples concrets.',
    date: '2026-03-25',
    type: 'content',
  },
  {
    id: '3',
    title: 'Minuteur Pomodoro intégré',
    description: "Un minuteur de session d'étude pour optimiser votre temps d'apprentissage.",
    date: '2026-03-20',
    type: 'feature',
  },
  {
    id: '4',
    title: 'Nouveau TP : Classification Iris',
    description: 'Un TP complet sur la classification avec le célèbre dataset Iris.',
    date: '2026-03-15',
    type: 'content',
  },
  {
    id: '5',
    title: 'Marathon ML 2026',
    description: "Participez à notre défi de 30 jours consécutifs d'apprentissage ML.",
    date: '2026-04-10',
    type: 'event',
  },
];

const announcementTypeConfig: Record<Announcement['type'], { icon: typeof Zap; label: string; badgeClass: string; borderClass: string }> = {
  feature: { icon: Zap, label: 'Fonctionnalité', badgeClass: 'bg-primary/15 text-primary-foreground border-primary/30', borderClass: 'border-l-primary' },
  content: { icon: BookOpen, label: 'Contenu', badgeClass: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30', borderClass: 'border-l-emerald-500' },
  event: { icon: Calendar, label: 'Événement', badgeClass: 'bg-amber-500/15 text-amber-400 border-amber-500/30', borderClass: 'border-l-amber-500' },
};

// ─── Cheat Sheet Data ─────────────────────────────────────────────
interface CheatSheetEntry {
  formulas: string[];
  methods: string[];
  pitfalls: string[];
  tip: string;
}

const cheatsheetData: Record<CourseSectionId, CheatSheetEntry> = {
  intro: {
    formulas: [
      'Accuracy = (Prédictions correctes) / (Total)',
      'Erreur = 1 - Accuracy',
      'Biais² + Variance = Erreur totale',
    ],
    methods: [
      'sklearn.model_selection.train_test_split(X, y, test_size=0.2)',
      'sklearn.preprocessing.StandardScaler().fit_transform(X)',
      'pandas.DataFrame.describe() # statistiques rapides',
    ],
    pitfalls: [
      'Ne jamais évaluer sur les données d\'entraînement',
      'Toujours vérifier l\'équilibre des classes avant de choisir une métrique',
    ],
    tip: 'Commencez toujours par une analyse exploratoire (EDA) avec df.describe(), df.info() et des visualisations avant toute modélisation.',
  },
  regression: {
    formulas: [
      'y = wx + b (Régression Linéaire Simple)',
      'MSE = (1/n) Σ(yᵢ - ŷᵢ)²',
      'R² = 1 - SS_res / SS_tot',
    ],
    methods: [
      'sklearn.linear_model.LinearRegression()',
      'model.fit(X_train, y_train) → model.predict(X_test)',
      'sklearn.metrics.r2_score(y_test, y_pred)',
    ],
    pitfalls: [
      'La régression linéaire suppose une relation linéaire — vérifiez avec un scatter plot',
      'Les outliers faussent énormément les coefficients — utilisez RobustScaler',
    ],
    tip: 'Vérifiez les résidus (y_true - y_pred) : ils doivent être normalement distribués et homoscédastiques pour un modèle valide.',
  },
  logistique: {
    formulas: [
      'σ(z) = 1 / (1 + e⁻ᶻ) (Fonction Sigmoïde)',
      'Log-Loss = -[y·log(ŷ) + (1-y)·log(1-ŷ)]',
      'Seuil de décision : ŷ ≥ 0.5 → Classe 1',
    ],
    methods: [
      'sklearn.linear_model.LogisticRegression(max_iter=1000)',
      'model.predict_proba(X_test)[:, 1] # probabilités classe 1',
      'sklearn.metrics.roc_auc_score(y_test, y_proba)',
    ],
    pitfalls: [
      'N\'oubliez pas de normaliser les features avant la régression logistique',
      'Pour les classes déséquilibrées, utilisez class_weight="balanced"',
    ],
    tip: 'Utilisez ROC-AUC plutôt que l\'accuracy pour évaluer un modèle de classification binaire, surtout si les classes sont déséquilibrées.',
  },
  randomforest: {
    formulas: [
      'Prédiction = Vote majoritaire (classification) ou Moyenne (régression)',
      'Gini = 1 - Σ(pᵢ)² (critère de split par défaut)',
      'OOB Error ≈ Error de validation croisée',
    ],
    methods: [
      'sklearn.ensemble.RandomForestClassifier(n_estimators=200)',
      'model.feature_importances_ # importance des variables',
      'sklearn.model_selection.GridSearchCV(rf, param_grid, cv=5)',
    ],
    pitfalls: [
      'Un max_depth trop grand → surapprentissage. Commencez avec None puis réduisez',
      'N\'utilisez pas n_jobs=-1 en production (risque de saturation mémoire)',
    ],
    tip: 'Le Random Forest est un excellent "out-of-the-box" pour les datasets tabulaires. Commencez par lui avant d\'essayer XGBoost ou LightGBM.',
  },
  neural: {
    formulas: [
      'a = σ(Wx + b) (Propagation avant)',
      '∂L/∂w = ∂L/∂a · ∂a/∂w (Règle de la chaîne)',
      'ReLU(x) = max(0, x) — activation recommandée',
    ],
    methods: [
      'keras.Sequential([layers.Dense(128, activation="relu"), ...])',
      'model.compile(optimizer="adam", loss="binary_crossentropy")',
      'keras.callbacks.EarlyStopping(monitor="val_loss", patience=10)',
    ],
    pitfalls: [
      'Sans EarlyStopping, le réseau surapprend très rapidement les données d\'entraînement',
      'Le Dropout (0.2-0.5) est essentiel pour éviter le surapprentissage',
    ],
    tip: 'Pour les petits datasets (< 10 000 exemples), préférez Random Forest ou SVM aux réseaux de neurones qui nécessitent beaucoup de données.',
  },
  lstm: {
    formulas: [
      'fₜ = σ(Wf·[hₜ₋₁, xₜ] + bf) (Forget Gate)',
      'iₜ = σ(Wi·[hₜ₋₁, xₜ] + bi) (Input Gate)',
      'Cₜ = fₜ⊙Cₜ₋₁ + iₜ⊙tanh(Wc·[hₜ₋₁, xₜ] + bc)',
    ],
    methods: [
      'keras.layers.LSTM(128, return_sequences=True)',
      'sklearn.preprocessing.MinMaxScaler(feature_range=(0, 1))',
      'model.fit(X_train, y_train, shuffle=False) # séries temporelles',
    ],
    pitfalls: [
      'Ne JAMAIS shuffle les séries temporelles lors du split train/test',
      'La longueur de séquence (seq_length) est l\'hyperparamètre le plus critique',
    ],
    tip: 'Normalisez toujours les séries temporelles avec MinMaxScaler avant d\'entraîner un LSTM. Les valeurs brutes peuvent faire exploser les gradients.',
  },
  metriques: {
    formulas: [
      'Precision = TP / (TP + FP)',
      'Recall = TP / (TP + FN)',
      'F1 = 2 × (Precision × Recall) / (Precision + Recall)',
    ],
    methods: [
      'sklearn.metrics.classification_report(y_test, y_pred)',
      'sklearn.metrics.confusion_matrix(y_test, y_pred)',
      'sklearn.metrics.roc_curve(y_test, y_proba)',
    ],
    pitfalls: [
      'L\'accuracy est trompeuse sur des classes déséquilibrées (ex: 99% négatif)',
      'Le F1-Score ne différencie pas les FP des FN — utilisez Precision ou Recall selon le contexte',
    ],
    tip: 'En médecine, privilégiez le Recall (ne pas manquer un malade). En spam, privilégiez la Precision (ne pas bloquer un email légitime).',
  },
  optimisation: {
    formulas: [
      'w = w - α · ∂L/∂w (Descente de gradient)',
      'β₁ = 0.9, β₂ = 0.999 (Hyperparamètres Adam)',
      'λ||w||² (Régularisation L2 / Ridge)',
    ],
    methods: [
      'sklearn.model_selection.GridSearchCV(model, params, cv=5)',
      'sklearn.model_selection.RandomizedSearchCV(model, params, n_iter=50)',
      'keras.optimizers.Adam(learning_rate=0.001)',
    ],
    pitfalls: [
      'Ne tunez jamais les hyperparamètres sur le jeu de test — gardez-le "inviolé"',
      'Un learning rate trop grand → divergence. Trop petit → convergence lente.',
    ],
    tip: 'Commencez par RandomizedSearchCV (plus rapide) pour trouver la zone optimale, puis affinez avec GridSearchCV dans cette zone.',
  },
};

// ─── Achievement Definitions ──────────────────────────────────────
interface AchievementDef {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  glowColor: string;
  check: (state: {
    completedSections: string[];
    quizVerified: Record<string, boolean>;
    quizScores: Record<string, number>;
    quizData: Record<string, { length: number }>;
    chapterNotes: Record<string, string>;
    bookmarkedTps: string[];
    tpsCount: number;
    visitedTabs: string[];
    openedChapters: string[];
    totalStudyTime: number;
  }) => boolean;
}

const achievementDefs: AchievementDef[] = [
  { id: 'premier_pas', name: 'Premier Pas', description: 'Visitez les 4 onglets principaux', icon: <Footprints className="w-5 h-5" />, color: 'text-emerald-400', glowColor: 'shadow-emerald-400/30', check: (s) => s.visitedTabs.filter(t => ['accueil', 'cours', 'tps', 'contact'].includes(t)).length >= 4 },
  { id: 'curieux', name: 'Curieux', description: 'Ouvrez 5 chapitres différents', icon: <Eye className="w-5 h-5" />, color: 'text-cyan-400', glowColor: 'shadow-cyan-400/30', check: (s) => s.openedChapters.length >= 5 },
  { id: 'quizzeur', name: 'Quizzeur', description: 'Complétez votre premier quiz', icon: <Brain className="w-5 h-5" />, color: 'text-amber-400', glowColor: 'shadow-amber-400/30', check: (s) => Object.keys(s.quizVerified).filter(k => s.quizVerified[k]).length >= 1 },
  { id: 'genie_du_quiz', name: 'Génie du Quiz', description: 'Complétez les 8 quizs', icon: <Trophy className="w-5 h-5" />, color: 'text-yellow-400', glowColor: 'shadow-yellow-400/30', check: (s) => Object.keys(s.quizVerified).filter(k => s.quizVerified[k]).length >= Object.keys(s.quizData).length },
  { id: 'noteur', name: 'Noteur', description: 'Écrivez votre première note de chapitre', icon: <Pencil className="w-5 h-5" />, color: 'text-purple-400', glowColor: 'shadow-purple-400/30', check: (s) => Object.keys(s.chapterNotes).filter(k => s.chapterNotes[k] && s.chapterNotes[k].trim().length > 0).length >= 1 },
  { id: 'explorateur', name: 'Explorateur', description: 'Bookmarquez votre premier TP', icon: <Compass className="w-5 h-5" />, color: 'text-primary-foreground', glowColor: 'shadow-primary-foreground/30', check: (s) => s.bookmarkedTps.length >= 1 },
  { id: 'dedicated', name: 'Dedicated', description: 'Étudiez pendant 30 minutes au total', icon: <Flame className="w-5 h-5" />, color: 'text-orange-400', glowColor: 'shadow-orange-400/30', check: (s) => s.totalStudyTime >= 1800 },
  { id: 'completionist', name: 'Completionist', description: 'Complétez les 8 chapitres', icon: <Award className="w-5 h-5" />, color: 'text-rose-400', glowColor: 'shadow-rose-400/30', check: (s) => s.completedSections.length >= 8 },
];

// ─── Main Page Component ─────────────────────────────────────────────
export default function Home() {
  const [activeTab, setActiveTab] = useState<TabId>('accueil');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeCourse, setActiveCourse] = useState<CourseSectionId>('intro');

  // Course Progress State
  const [completedSections, setCompletedSections] = useState<CourseSectionId[]>(() => {
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('ml-academy-progress');
        if (stored) return JSON.parse(stored) as CourseSectionId[];
      }
    } catch {
      // ignore localStorage errors
    }
    return [];
  });
  const prevCourseRef = useRef<CourseSectionId>('intro');

  // Persist progress to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('ml-academy-progress', JSON.stringify(completedSections));
    } catch {
      // ignore
    }
  }, [completedSections]);

  // TPs State
  const [tps, setTps] = useState<TPData[]>([]);
  const [tpsLoading, setTpsLoading] = useState(true);
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  // Add TP form state
  const [newTp, setNewTp] = useState({
    title: '',
    description: '',
    category: 'Classification',
    difficulty: 'Débutant',
    duration: '30 min',
    color: '#6366f1',
    colabUrl: '',
    kaggleUrl: '',
    datasetName: '',
    datasetRows: '',
    datasetCols: '',
    objective: '',
    expectedResult: '',
    steps: [''],
    concepts: [''],
    tags: '',
  });

  // Contact form state
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [contactSending, setContactSending] = useState(false);
  const [contactSuccess, setContactSuccess] = useState<{ emailSent: boolean } | null>(null);
  const [contactErrors, setContactErrors] = useState<Record<string, string>>({});

  // Admin State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminToken, setAdminToken] = useState('');
  const [adminTab, setAdminTab] = useState<'notebooks' | 'messages' | 'stats' | 'settings' | 'chapters'>('stats');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminLoginError, setAdminLoginError] = useState('');
  const [adminLoginLoading, setAdminLoginLoading] = useState(false);
  const [adminNotebooks, setAdminNotebooks] = useState<Array<{
    id: string; title: string; description: string; fileName: string; filePath: string;
    fileSize: number; chapter: string; visible: boolean; createdAt: string; updatedAt: string;
  }>>([]);
  const [adminFeedbacks, setAdminFeedbacks] = useState<Array<{
    id: string; name: string; email: string; subject: string; message: string;
    read: boolean; createdAt: string;
  }>>([]);
  const [adminUploading, setAdminUploading] = useState(false);
  const [adminNewNotebook, setAdminNewNotebook] = useState({
    title: '', description: '', chapter: '', visible: 'true', file: null as File | null,
  });
  const [expandedFeedback, setExpandedFeedback] = useState<string | null>(null);

  // Admin Email Settings State
  const [adminSettings, setAdminSettings] = useState({
    notifyEmail: '', smtpHost: '', smtpPort: 587, smtpUser: '', smtpPass: '',
    notifyOnCreate: true, notifyOnUpdate: true, notifyOnDelete: true,
  });
  const [adminSettingsLoading, setAdminSettingsLoading] = useState(false);
  const [testEmailLoading, setTestEmailLoading] = useState(false);
  const [adminSettingsSaved, setAdminSettingsSaved] = useState(false);

  // Course Chapters State (admin)
  const [adminChapters, setAdminChapters] = useState<Array<{
    id: string; title: string; description: string; type: string;
    content: string; order: number; sectionId: string;
    notebooks: Array<{ id: string; title: string; fileName: string; fileSize: number; colabUrl: string; visible: boolean }>;
    createdAt: string; updatedAt: string;
  }>>([]);
  const [adminNewChapter, setAdminNewChapter] = useState({
    title: '', description: '', type: 'chapter', content: '', sectionId: '', order: 0,
  });
  const [adminChapterUploading, setAdminChapterUploading] = useState(false);
  const [adminChapterNotebookFile, setAdminChapterNotebookFile] = useState<File | null>(null);
  const [adminChapterNotebookColabUrl, setAdminChapterNotebookColabUrl] = useState('');
  const [selectedChapterForNotebook, setSelectedChapterForNotebook] = useState('');

  // Admin login rate limiting
  const [adminLoginAttempts, setAdminLoginAttempts] = useState(0);
  const [adminLoginLockedUntil, setAdminLoginLockedUntil] = useState(0);

  // Public chapters for Cours tab
  const [publicChapters, setPublicChapters] = useState<Array<{
    id: string; title: string; description: string; type: string;
    content: string; order: number; sectionId: string;
    notebooks: Array<{ id: string; title: string; fileName: string; fileSize: number; colabUrl: string; visible: boolean }>;
    createdAt: string; updatedAt: string;
  }>>([]);

  // Notebook upload for TPs (admin)
  const [tpNotebookUpload, setTpNotebookUpload] = useState<File | null>(null);
  const [tpNotebookUploading, setTpNotebookUploading] = useState(false);

  // TP UI State
  const [expandedTp, setExpandedTp] = useState<string | null>(null);
  const [tpSearch, setTpSearch] = useState('');
  const [tpCategoryFilter, setTpCategoryFilter] = useState('Tous');
  const [tpDifficultyFilter, setTpDifficultyFilter] = useState('Tous');
  const [glossarySearch, setGlossarySearch] = useState('');
  const [formulaSearch, setFormulaSearch] = useState('');
  const [formulaCategoryFilter, setFormulaCategoryFilter] = useState<'Tous' | FormulaCard['category']>('Tous');
  const [scrollProgress, setScrollProgress] = useState(0);

  // Tip of the day state (persisted in localStorage)
  const [tipOffset, setTipOffset] = useState(() => {
    try { if (typeof window !== 'undefined') { const s = localStorage.getItem('ml-academy-tip-index'); if (s) return parseInt(s, 10) || 0; } } catch { /* ignore */ } return 0;
  });
  const [tipKey, setTipKey] = useState(0);

  // Persist tip index to localStorage
  useEffect(() => {
    try { localStorage.setItem('ml-academy-tip-index', String(tipOffset)); } catch { /* ignore */ }
  }, [tipOffset]);

  // Tab visit tracking (for achievements)
  const [visitedTabs, setVisitedTabs] = useState<string[]>(() => {
    try { if (typeof window !== 'undefined') { const s = localStorage.getItem('ml-academy-visited-tabs'); if (s) return JSON.parse(s); } } catch { /* ignore */ } return [];
  });

  // Chapter open tracking (for achievements)
  const [openedChapters, setOpenedChapters] = useState<string[]>(() => {
    try { if (typeof window !== 'undefined') { const s = localStorage.getItem('ml-academy-opened-chapters'); if (s) return JSON.parse(s); } } catch { /* ignore */ } return [];
  });

  // Persist visited tabs to localStorage
  useEffect(() => {
    try { localStorage.setItem('ml-academy-visited-tabs', JSON.stringify(visitedTabs)); } catch { /* ignore */ }
  }, [visitedTabs]);

  // Persist opened chapters to localStorage
  useEffect(() => {
    try { localStorage.setItem('ml-academy-opened-chapters', JSON.stringify(openedChapters)); } catch { /* ignore */ }
  }, [openedChapters]);

  // Daily Challenge state
  const [completedDailyChallenges, setCompletedDailyChallenges] = useState<string[]>(() => {
    try { if (typeof window !== 'undefined') { const s = localStorage.getItem('ml-academy-daily-challenges'); if (s) return JSON.parse(s); } } catch { /* ignore */ } return [];
  });
  const [challengeNavOffset, setChallengeNavOffset] = useState(0);
  const [challengeKey, setChallengeKey] = useState(0);

  // Persist completed daily challenges to localStorage
  useEffect(() => {
    try { localStorage.setItem('ml-academy-daily-challenges', JSON.stringify(completedDailyChallenges)); } catch { /* ignore */ }
  }, [completedDailyChallenges]);

  // Algorithm comparison sort state
  const [sortColumn, setSortColumn] = useState<keyof AlgorithmComparison | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Public notebooks state
  const [publicNotebooks, setPublicNotebooks] = useState<Array<{
    id: string; title: string; description: string; fileName: string;
    fileSize: number; chapter: string; createdAt: string;
  }>>([]);
  const [notebooksLoading, setNotebooksLoading] = useState(false);

  // Quiz difficulty mapping
  const quizDifficultyMap: Record<string, { label: string; color: string }> = {
    intro: { label: 'Facile', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
    regression: { label: 'Facile', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
    logistique: { label: 'Moyen', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
    randomforest: { label: 'Moyen', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
    neural: { label: 'Difficile', color: 'bg-red-500/10 text-red-400 border-red-500/20' },
    metriques: { label: 'Difficile', color: 'bg-red-500/10 text-red-400 border-red-500/20' },
    lstm: { label: 'Expert', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
    optimisation: { label: 'Expert', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
  };

  // Back to top
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Quiz State
  const [showQuiz, setShowQuiz] = useState<string | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, Record<string, string | null>>>({});
  const [quizVerified, setQuizVerified] = useState<Record<string, boolean>>({});
  const [quizScores, setQuizScores] = useState<Record<string, number>>({});
  const [quizShuffle, setQuizShuffle] = useState<Record<string, number[]>>({});

  // Quiz Timer State
  const [quizTimer, setQuizTimer] = useState<Record<string, number>>({});
  const [quizTimerActive, setQuizTimerActive] = useState<Record<string, boolean>>({});

  // Quiz stats (computed AFTER quiz state initialization)
  const completedQuizzes = Object.keys(quizVerified).filter(k => quizVerified[k]).length;
  const totalQuizzes = Object.keys(quizData).length;

  // TP Bookmarking State
  const [bookmarkedTps, setBookmarkedTps] = useState<string[]>(() => {
    try { if (typeof window !== 'undefined') { const s = localStorage.getItem('ml-academy-bookmarks'); if (s) return JSON.parse(s); } } catch {} return [];
  });

  // Persist bookmarks to localStorage
  useEffect(() => {
    try { localStorage.setItem('ml-academy-bookmarks', JSON.stringify(bookmarkedTps)); } catch {}
  }, [bookmarkedTps]);

  // TP Star Rating State
  const [tpRatings, setTpRatings] = useState<Record<string, number>>(() => {
    try { if (typeof window !== 'undefined') { const s = localStorage.getItem('ml-academy-ratings'); if (s) return JSON.parse(s); } } catch {} return {};
  });

  // Persist ratings to localStorage
  useEffect(() => {
    try { localStorage.setItem('ml-academy-ratings', JSON.stringify(tpRatings)); } catch {}
  }, [tpRatings]);

  const setTpRating = (tpId: string, rating: number) => {
    setTpRatings(prev => {
      // Allow clearing by clicking the same star again
      if (prev[tpId] === rating) {
        const next = { ...prev };
        delete next[tpId];
        return next;
      }
      return { ...prev, [tpId]: rating };
    });
  };

  const toggleBookmark = (tpId: string) => {
    const isRemoving = bookmarkedTps.includes(tpId);
    const tp = tps.find(t => t.id === tpId);
    setBookmarkedTps(prev =>
      prev.includes(tpId) ? prev.filter(id => id !== tpId) : [...prev, tpId]
    );
    if (tp) {
      addActivity('Favori modifié', isRemoving ? `${tp.title} retiré` : `${tp.title} ajouté`, 'Bookmark');
    }
    setTimeout(() => {
      const newBookmarks = bookmarkedTps.includes(tpId) ? bookmarkedTps.filter(id => id !== tpId) : [...bookmarkedTps, tpId];
      checkAchievements({ completedSections, quizVerified, quizScores, chapterNotes, bookmarkedTps: newBookmarks });
    }, 500);
  };

  // Chapter Notes State
  const [chapterNotes, setChapterNotes] = useState<Record<string, string>>(() => {
    try { if (typeof window !== 'undefined') { const s = localStorage.getItem('ml-academy-notes'); if (s) return JSON.parse(s); } } catch {} return {};
  });
  const [showNotes, setShowNotes] = useState<string | null>(null);
  const [showCheatSheet, setShowCheatSheet] = useState<string | null>(null);

  // Persist notes to localStorage
  useEffect(() => {
    try { localStorage.setItem('ml-academy-notes', JSON.stringify(chapterNotes)); } catch {}
  }, [chapterNotes]);

  // Quiz Timer: auto-start when quiz is opened, auto-verify at 0
  const quizTimerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // Clean up previous interval
    if (quizTimerIntervalRef.current) {
      clearInterval(quizTimerIntervalRef.current);
      quizTimerIntervalRef.current = null;
    }

    if (showQuiz && !quizVerified[showQuiz]) {
      // Start or reset timer for this quiz
      if (!quizTimerActive[showQuiz]) {
        setQuizTimer(prev => ({ ...prev, [showQuiz]: 30 }));
        setQuizTimerActive(prev => ({ ...prev, [showQuiz]: true }));
      }

      quizTimerIntervalRef.current = setInterval(() => {
        setQuizTimer(prev => {
          const current = prev[showQuiz] ?? 30;
          if (current <= 1) {
            // Timer reached 0 — auto-verify
            if (quizTimerIntervalRef.current) {
              clearInterval(quizTimerIntervalRef.current);
              quizTimerIntervalRef.current = null;
            }
            setQuizTimerActive(prev2 => ({ ...prev2, [showQuiz]: false }));

            // Auto-verify answers
            setQuizVerified(prevV => {
              if (prevV[showQuiz]) return prevV; // already verified
              const answers = quizAnswers[showQuiz] || {};
              const questions = quizData[showQuiz];
              if (!questions) return prevV;
              let score = 0;
              questions.forEach((q, qIdx) => {
                if (answers[qIdx] === String(q.correctIndex)) {
                  score++;
                }
              });
              setQuizScores(prevS => ({ ...prevS, [showQuiz]: score }));
              toast.warning('Temps écoulé ! Réponses vérifiées automatiquement.');
              const quizChapter = courseSections.find(s => s.id === showQuiz);
              addActivity('Quiz terminé', `${quizChapter?.title || showQuiz} — ${score}/${questions.length}`, 'Brain');
              setTimeout(() => checkAchievements({
                completedSections,
                quizVerified: { ...prevV, [showQuiz]: true },
                quizScores: { ...quizScores, [showQuiz]: score },
                chapterNotes,
                bookmarkedTps,
              }), 500);
              return { ...prevV, [showQuiz]: true };
            });

            return { ...prev, [showQuiz]: 0 };
          }
          return { ...prev, [showQuiz]: current - 1 };
        });
      }, 1000);
    }

    return () => {
      if (quizTimerIntervalRef.current) {
        clearInterval(quizTimerIntervalRef.current);
        quizTimerIntervalRef.current = null;
      }
    };
  }, [showQuiz]);

  // TP Import
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Study Timer State
  const [showStudyTimer, setShowStudyTimer] = useState(false);
  const [studyTimer, setStudyTimer] = useState({ isRunning: false, seconds: 0, mode: 'focus' as 'focus' | 'break', focusDuration: 25 * 60, breakDuration: 5 * 60 });

  // Total study time (localStorage)
  const [totalStudyTime, setTotalStudyTime] = useState<number>(() => {
    try { if (typeof window !== 'undefined') { const s = localStorage.getItem('ml-academy-study-time'); if (s) return JSON.parse(s); } } catch {} return 0;
  });

  // Daily study time tracking for streak calendar (localStorage)
  const [dailyStudyTime, setDailyStudyTime] = useState<Record<string, number>>(() => {
    try {
      if (typeof window !== 'undefined') {
        const s = localStorage.getItem('ia-academy-daily-study');
        if (s) return JSON.parse(s);
      }
    } catch {}
    return {};
  });

  // Save daily study time when studyTimer runs (accumulate seconds per day)
  useEffect(() => {
    if (!studyTimer.isRunning || studyTimer.mode !== 'focus') return;
    const interval = setInterval(() => {
      const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
      setDailyStudyTime(prev => {
        const next = { ...prev, [today]: (prev[today] || 0) + 1 };
        try { localStorage.setItem('ia-academy-daily-study', JSON.stringify(next)); } catch {}
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [studyTimer.isRunning, studyTimer.mode]);

  // Stats bar visibility
  const [showStatsBar, setShowStatsBar] = useState(true);

  // Keyboard shortcuts overlay
  const [showShortcuts, setShowShortcuts] = useState(false);

  // Theme State
  type ThemeMode = 'dark' | 'light' | 'system';
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    try { if (typeof window !== 'undefined') { return (localStorage.getItem('ia-academy-theme-mode') as ThemeMode) || 'system'; } } catch {} return 'system';
  });
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('ml-academy-theme') as 'dark' | 'light';
        if (stored) return stored;
        const mode = localStorage.getItem('ia-academy-theme-mode') as ThemeMode;
        if (mode === 'system' || !mode) {
          return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        return mode === 'dark' ? 'dark' : 'light';
      }
    } catch {} return 'dark';
  });

  // Apply theme class to document
  useEffect(() => {
    try { localStorage.setItem('ml-academy-theme', theme); } catch {}
    // Smooth transition
    document.documentElement.style.transition = 'background-color 0.3s, color 0.3s';
    document.documentElement.classList.add('theme-transitioning');
    if (theme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
    // Remove transitioning class after animation completes
    const timer = setTimeout(() => {
      document.documentElement.classList.remove('theme-transitioning');
      document.documentElement.style.transition = '';
    }, 350);
    return () => clearTimeout(timer);
  }, [theme]);

  // Listen for system theme changes when in 'system' mode
  useEffect(() => {
    if (themeMode !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => {
      setTheme(e.matches ? 'dark' : 'light');
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [themeMode]);

  const handleThemeModeChange = (mode: ThemeMode) => {
    setThemeMode(mode);
    try { localStorage.setItem('ia-academy-theme-mode', mode); } catch {}
    if (mode === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
    } else {
      setTheme(mode);
    }
  };

  const toggleTheme = () => {
    if (themeMode === 'system') {
      setThemeMode('dark');
      try { localStorage.setItem('ia-academy-theme-mode', 'dark'); } catch {}
      setTheme('dark');
    } else {
      const next = theme === 'dark' ? 'light' : 'dark';
      setTheme(next);
    }
  };

  // ─── Quick Notes State ──────────────────────────────────────────
  const [quickNotes, setQuickNotes] = useState<string>(() => {
    try { if (typeof window !== 'undefined') { return localStorage.getItem('ml-academy-quick-notes') || ''; } } catch {} return '';
  });
  const [quickNotesSheetOpen, setQuickNotesSheetOpen] = useState(false);
  const [quickNotesLastSave, setQuickNotesLastSave] = useState<string>(() => {
    try { if (typeof window !== 'undefined') { return localStorage.getItem('ml-academy-quick-notes-save-time') || ''; } } catch {} return '';
  });
  const [quickNotesSaving, setQuickNotesSaving] = useState(false);
  const quickNotesDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const notesActivityDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleQuickNotesChange = useCallback((value: string) => {
    setQuickNotes(value);
    setQuickNotesSaving(true);
    if (quickNotesDebounceRef.current) clearTimeout(quickNotesDebounceRef.current);
    quickNotesDebounceRef.current = setTimeout(() => {
      try { localStorage.setItem('ml-academy-quick-notes', value); } catch {}
      const now = new Date();
      const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      try { localStorage.setItem('ml-academy-quick-notes-save-time', timeStr); } catch {}
      setQuickNotesLastSave(timeStr);
      setQuickNotesSaving(false);
    }, 500);
  }, []);

  const clearQuickNotes = useCallback(() => {
    setQuickNotes('');
    try { localStorage.removeItem('ml-academy-quick-notes'); } catch {}
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    try { localStorage.setItem('ml-academy-quick-notes-save-time', timeStr); } catch {}
    setQuickNotesLastSave(timeStr);
    toast.success('Notes effacées avec succès');
  }, []);

  // ─── Activity Log ──────────────────────────────────────────────
  interface ActivityEntry {
    id: string;
    action: string;
    detail: string;
    timestamp: string;
    icon: string;
  }

  const [activityLog, setActivityLog] = useState<ActivityEntry[]>(() => {
    try {
      if (typeof window !== 'undefined') {
        const s = localStorage.getItem('ia-academy-activity-log');
        if (s) return JSON.parse(s);
      }
    } catch {}
    return [];
  });

  const [showAllActivity, setShowAllActivity] = useState(false);

  useEffect(() => {
    try { localStorage.setItem('ia-academy-activity-log', JSON.stringify(activityLog)); } catch {}
  }, [activityLog]);

  const addActivity = useCallback((action: string, detail: string, icon: string) => {
    const entry: ActivityEntry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      action,
      detail,
      timestamp: new Date().toISOString(),
      icon,
    };
    setActivityLog(prev => [entry, ...prev].slice(0, 50));
  }, []);

  const formatRelativeTime = (timestamp: string): string => {
    const now = Date.now();
    const then = new Date(timestamp).getTime();
    const diffMs = now - then;
    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) return `il y a ${seconds} seconde${seconds > 1 ? 's' : ''}`;
    if (minutes < 60) return `il y a ${minutes} minute${minutes > 1 ? 's' : ''}`;
    if (hours < 24) return `il y a ${hours} heure${hours > 1 ? 's' : ''}`;
    return `il y a ${days} jour${days > 1 ? 's' : ''}`;
  };

  // ─── Scroll Progress Indicator ─────────────────────────────────
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        setScrollProgress(Math.min((scrollTop / docHeight) * 100, 100));
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ─── Fetch Public Notebooks ────────────────────────────────────
  const fetchPublicNotebooks = useCallback(async () => {
    try {
      setNotebooksLoading(true);
      const res = await fetch('/api/notebooks');
      if (res.ok) {
        const data = await res.json();
        setPublicNotebooks(data);
      }
    } catch {
      // silent
    } finally {
      setNotebooksLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPublicNotebooks();
  }, [fetchPublicNotebooks]);

  // TP Edit State
  const [editingTpId, setEditingTpId] = useState<string | null>(null);

  // Study Streak State
  const [streak, setStreak] = useState<{ lastStudyDate: string; currentStreak: number }>(() => {
    try { if (typeof window !== 'undefined') { const s = localStorage.getItem('ml-academy-streak'); if (s) return JSON.parse(s); } } catch {} return { lastStudyDate: '', currentStreak: 0 };
  });

  // Achievements State
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>(() => {
    try { if (typeof window !== 'undefined') { const s = localStorage.getItem('ml-academy-achievements'); if (s) return JSON.parse(s); } } catch {} return [];
  });
  const [showAchievements, setShowAchievements] = useState(false);

  // Onboarding State
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);

  // Onboarding check
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && !localStorage.getItem('ml-academy-onboarded')) {
        setShowOnboarding(true);
      }
    } catch {}
  }, []);

  // Persist streak to localStorage
  useEffect(() => {
    try { localStorage.setItem('ml-academy-streak', JSON.stringify(streak)); } catch {}
  }, [streak]);

  // Persist achievements to localStorage
  useEffect(() => {
    try { localStorage.setItem('ml-academy-achievements', JSON.stringify(unlockedAchievements)); } catch {}
  }, [unlockedAchievements]);

  // Mark as studied (updates streak)
  const markAsStudied = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    setStreak(prev => {
      if (prev.lastStudyDate === today) return prev;
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      if (prev.lastStudyDate === yesterday) {
        return { lastStudyDate: today, currentStreak: prev.currentStreak + 1 };
      }
      return { lastStudyDate: today, currentStreak: 1 };
    });
  }, []);

  // Check achievements and unlock new ones
  const checkAchievements = useCallback((currentState: {
    completedSections: CourseSectionId[];
    quizVerified: Record<string, boolean>;
    quizScores: Record<string, number>;
    chapterNotes: Record<string, string>;
    bookmarkedTps: string[];
  }) => {
    for (const ach of achievementDefs) {
      if (!unlockedAchievements.includes(ach.id)) {
        const passed = ach.check({
          completedSections: currentState.completedSections,
          quizVerified: currentState.quizVerified,
          quizScores: currentState.quizScores,
          quizData: Object.fromEntries(Object.entries(quizData).map(([k, v]) => [k, { length: v.length }])),
          chapterNotes: currentState.chapterNotes,
          bookmarkedTps: currentState.bookmarkedTps,
          tpsCount: tps.length,
          visitedTabs,
          openedChapters,
          totalStudyTime,
        });
        if (passed) {
          setUnlockedAchievements(prev => [...prev, ach.id]);
          toast.success(`Nouveau succès : ${ach.name} !`, { className: 'animate-bounce-in' });
        }
      }
    }
  }, [unlockedAchievements, tps.length, visitedTabs, openedChapters, totalStudyTime]);

  // Stats bar computed values (after all state declarations they depend on)
  const hasProgress = completedSections.length > 0 || totalStudyTime > 0 || completedQuizzes > 0;
  const totalQuizScore = Object.values(quizScores).reduce((a, b) => a + b, 0);
  const totalQuizQuestions = Object.keys(quizScores).reduce((a, k) => a + (quizData[k]?.length || 0), 0);

  // Command Palette State
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [commandSearch, setCommandSearch] = useState('');
  const [selectedCommandIndex, setSelectedCommandIndex] = useState(0);
  const commandInputRef = useRef<HTMLInputElement>(null);

  // Command items definition
  const commandItems = [
    { type: 'nav' as const, label: 'Accueil', description: 'Page d\'accueil et présentation', icon: <GraduationCap className="w-4 h-4" />, action: () => switchTab('accueil') },
    { type: 'nav' as const, label: 'Cours', description: '8 chapitres de Machine Learning', icon: <BookOpen className="w-4 h-4" />, action: () => switchTab('cours') },
    { type: 'nav' as const, label: 'TPs', description: 'Travaux pratiques et projets', icon: <FlaskConical className="w-4 h-4" />, action: () => switchTab('tps') },
    { type: 'nav' as const, label: 'Contact', description: 'Formulaire et FAQ', icon: <Mail className="w-4 h-4" />, action: () => switchTab('contact') },
    { type: 'nav' as const, label: 'Administration', description: 'Gestion notebooks et messages', icon: <Shield className="w-4 h-4" />, action: () => switchTab('admin') },
    ...courseSections.map((cs) => ({
      type: 'chapter' as const,
      label: cs.title,
      description: `Chapitre ${courseSections.indexOf(cs) + 1} sur ${courseSections.length}`,
      icon: cs.icon,
      sectionId: cs.id,
      action: () => { switchTab('cours'); handleChapterChange(cs.id); },
    })),
    { type: 'action' as const, label: 'Réinitialiser les filtres', description: 'Effacer les filtres de recherche TPs', icon: <RotateCcw className="w-4 h-4" />, action: () => { setTpSearch(''); setTpCategoryFilter('Tous'); setTpDifficultyFilter('Tous'); } },
  ];

  const filteredCommands = commandItems.filter((item) => {
    if (!commandSearch) return true;
    const lower = commandSearch.toLowerCase();
    return item.label.toLowerCase().includes(lower) || item.description.toLowerCase().includes(lower);
  });

  // Reset selected index when filtered list changes
  useEffect(() => {
    setSelectedCommandIndex(0);
  }, [commandSearch]);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Command Palette: Ctrl+K / Cmd+K keyboard shortcut + ? for shortcuts + 1-4 for tabs
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger when typing in inputs
      const tag = (e.target as HTMLElement).tagName;
      const isInput = tag === 'INPUT' || tag === 'TEXTAREA' || (e.target as HTMLElement).isContentEditable;

      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
        setCommandSearch('');
        setSelectedCommandIndex(0);
      } else if (e.key === '?' && !isInput) {
        e.preventDefault();
        setShowShortcuts(prev => !prev);
      } else if (e.key === 'Escape') {
        if (showShortcuts) setShowShortcuts(false);
        if (showStudyTimer) setShowStudyTimer(false);
      } else if (!isInput && !e.metaKey && !e.ctrlKey && !e.altKey) {
        if (e.key === '1') switchTab('accueil');
        if (e.key === '2') switchTab('cours');
        if (e.key === '3') switchTab('tps');
        if (e.key === '4') switchTab('contact');
        if (e.key === '5') switchTab('admin');
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showShortcuts, showStudyTimer]);

  // Study Timer: tick effect
  useEffect(() => {
    if (!studyTimer.isRunning) return;
    const interval = setInterval(() => {
      setStudyTimer(prev => {
        const next = prev.seconds - 1;
        if (next <= 0) {
          // Auto-switch mode
          const isFocusToBreak = prev.mode === 'focus';
          const newMode = isFocusToBreak ? 'break' : 'focus';
          const newDuration = isFocusToBreak ? prev.breakDuration : prev.focusDuration;
          toast.success(isFocusToBreak ? 'Session de focus terminée ! Prenez une pause.' : 'Pause terminée ! Reprenez le focus.');
          return { ...prev, mode: newMode, seconds: newDuration };
        }
        return { ...prev, seconds: next };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [studyTimer.isRunning]);

  // Save study time to localStorage every second the timer runs
  useEffect(() => {
    if (!studyTimer.isRunning) return;
    const interval = setInterval(() => {
      setTotalStudyTime(prev => {
        const next = prev + 1;
        try { localStorage.setItem('ml-academy-study-time', JSON.stringify(next)); } catch {}
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [studyTimer.isRunning]);

  // Stats bar auto-hide on scroll
  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setShowStatsBar(false);
      } else {
        setShowStatsBar(true);
      }
      lastScrollY = currentScrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Command Palette: execute command
  const executeCommand = useCallback((action: () => void) => {
    setCommandPaletteOpen(false);
    setCommandSearch('');
    setSelectedCommandIndex(0);
    action();
  }, []);

  // Command Palette: keyboard navigation within the palette
  const handleCommandKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedCommandIndex((prev) => Math.min(prev + 1, filteredCommands.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedCommandIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && filteredCommands[selectedCommandIndex]) {
      e.preventDefault();
      executeCommand(filteredCommands[selectedCommandIndex].action);
    }
  }, [filteredCommands, selectedCommandIndex, executeCommand]);
  useEffect(() => {
    try {
      const hash = window.location.hash.replace('#', '');
      const validTabs: TabId[] = ['accueil', 'cours', 'tps', 'contact'];
      if (hash && validTabs.includes(hash as TabId)) {
        setActiveTab(hash as TabId);
      }
    } catch {
      // SSR safety
    }
  }, []);

  // Hash-based tab routing: listen to hashchange for back/forward
  const handleHashChange = useCallback(() => {
    try {
      const hash = window.location.hash.replace('#', '');
      const validTabs: TabId[] = ['accueil', 'cours', 'tps', 'contact'];
      if (hash && validTabs.includes(hash as TabId)) {
        setActiveTab(hash as TabId);
      }
    } catch {
      // SSR safety
    }
  }, []);

  useEffect(() => {
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [handleHashChange]);

  // Sync hash when activeTab changes programmatically
  useEffect(() => {
    try {
      const currentHash = window.location.hash.replace('#', '');
      if (currentHash !== activeTab) {
        window.location.hash = activeTab;
      }
    } catch {
      // SSR safety
    }
  }, [activeTab]);

  // Fetch TPs
  const fetchTps = useCallback(async () => {
    try {
      setTpsLoading(true);
      const res = await fetch('/api/tps');
      if (res.ok) {
        const data = await res.json();
        setTps(data);
      }
    } catch {
      toast.error('Erreur lors du chargement des TPs');
    } finally {
      setTpsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTps();
  }, [fetchTps]);

  // Delete TP
  const deleteTp = async (id: string) => {
    try {
      const res = await fetch(`/api/tps/${id}`, { method: 'DELETE', headers: adminToken ? { Authorization: `Bearer ${adminToken}` } : {} });
      if (res.ok) {
        toast.success('TP supprimé avec succès');
        fetchTps();
      }
    } catch {
      toast.error('Erreur lors de la suppression');
    }
  };

  // Seed DB
  const seedDatabase = async () => {
    try {
      const res = await fetch('/api/seed', { method: 'POST', headers: adminToken ? { Authorization: `Bearer ${adminToken}` } : {} });
      if (res.ok) {
        toast.success('Base de données réinitialisée avec succès');
        fetchTps();
      }
    } catch {
      toast.error('Erreur lors du réensemencement');
    }
  };

  // Edit TP — open dialog pre-filled
  const handleEditTp = (tp: TPData) => {
    setEditingTpId(tp.id);
    setNewTp({
      title: tp.title,
      description: tp.description,
      category: tp.category,
      difficulty: tp.difficulty,
      duration: tp.duration,
      color: tp.color,
      colabUrl: tp.colabUrl,
      kaggleUrl: tp.kaggleUrl,
      datasetName: tp.datasetName,
      datasetRows: tp.datasetRows,
      datasetCols: tp.datasetCols,
      objective: tp.objective,
      expectedResult: tp.expectedResult,
      steps: JSON.parse(tp.steps || '[]').length > 0 ? JSON.parse(tp.steps || '[]') : [''],
      concepts: JSON.parse(tp.concepts || '[]').length > 0 ? JSON.parse(tp.concepts || '[]') : [''],
      tags: Array.isArray(JSON.parse(tp.tags || '[]')) ? (JSON.parse(tp.tags || '[]') as string[]).join(', ') : tp.tags,
    });
    setAddDialogOpen(true);
  };

  // Update TP (PUT)
  const updateTp = async () => {
    if (!editingTpId || !newTp.title.trim()) return;
    try {
      const res = await fetch(`/api/tps/${editingTpId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...(adminToken ? { Authorization: `Bearer ${adminToken}` } : {}) },
        body: JSON.stringify({
          ...newTp,
          steps: newTp.steps.filter((s) => s.trim()),
          concepts: newTp.concepts.filter((c) => c.trim()),
          tags: newTp.tags.split(',').map((t) => t.trim()).filter(Boolean),
        }),
      });
      if (res.ok) {
        toast.success('TP modifié avec succès');
        setAddDialogOpen(false);
        setEditingTpId(null);
        setNewTp({
          title: '', description: '', category: 'Classification', difficulty: 'Débutant',
          duration: '30 min', color: '#6366f1', colabUrl: '', kaggleUrl: '',
          datasetName: '', datasetRows: '', datasetCols: '', objective: '',
          expectedResult: '', steps: [''], concepts: [''], tags: '',
        });
        fetchTps();
      }
    } catch {
      toast.error("Erreur lors de la modification du TP");
    }
  };

  // Add TP
  const addTp = async () => {
    if (!newTp.title.trim() || !newTp.description.trim()) {
      toast.error('Le titre et la description sont obligatoires');
      return;
    }
    try {
      const res = await fetch('/api/tps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(adminToken ? { Authorization: `Bearer ${adminToken}` } : {}) },
        body: JSON.stringify({
          ...newTp,
          steps: newTp.steps.filter((s) => s.trim()),
          concepts: newTp.concepts.filter((c) => c.trim()),
          tags: newTp.tags.split(',').map((t) => t.trim()).filter(Boolean),
          order: tps.length + 1,
        }),
      });
      if (res.ok) {
        const newTp = await res.json();
        toast.success('TP ajouté avec succès');
        setAddDialogOpen(false);
        // Upload notebook if attached
        if (tpNotebookUpload) {
          const fd = new FormData();
          fd.append('file', tpNotebookUpload);
          fd.append('title', tpNotebookUpload.name.replace(/\.(ipynb|py|json)$/, ''));
          fd.append('tpId', newTp.id);
          fd.append('visible', 'true');
          fetch('/api/notebooks', { method: 'POST', headers: { Authorization: `Bearer ${adminToken}` }, body: fd }).catch(() => {});
          setTpNotebookUpload(null);
        }
        setNewTp({
          title: '', description: '', category: 'Classification', difficulty: 'Débutant',
          duration: '30 min', color: '#6366f1', colabUrl: '', kaggleUrl: '',
          datasetName: '', datasetRows: '', datasetCols: '', objective: '',
          expectedResult: '', steps: [''], concepts: [''], tags: '',
        });
        fetchTps();
      }
    } catch {
      toast.error('Erreur lors de l\'ajout du TP');
    }
  };

  // Submit Contact
  const validateContactForm = () => {
    const errors: Record<string, string> = {};
    if (!contactForm.name.trim()) errors.name = 'Le nom est requis';
    else if (contactForm.name.trim().length < 2) errors.name = 'Le nom doit contenir au moins 2 caractères';
    if (!contactForm.email.trim()) errors.email = "L'email est requis";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactForm.email.trim())) errors.email = "Format d'email invalide";
    if (!contactForm.subject.trim()) errors.subject = 'Le sujet est requis';
    else if (contactForm.subject.trim().length < 3) errors.subject = 'Le sujet doit contenir au moins 3 caractères';
    if (!contactForm.message.trim()) errors.message = 'Le message est requis';
    else if (contactForm.message.trim().length < 10) errors.message = 'Le message doit contenir au moins 10 caractères';
    else if (contactForm.message.length > 5000) errors.message = 'Le message ne doit pas dépasser 5000 caractères';
    setContactErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const submitContact = async () => {
    if (!validateContactForm()) return;
    try {
      setContactSending(true);
      setContactErrors({});
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactForm),
      });
      if (res.ok) {
        const data = await res.json();
        setContactSuccess({ emailSent: !!data.emailSent });
        setContactForm({ name: '', email: '', subject: '', message: '' });
      } else {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error || 'Erreur lors de l\'envoi');
      }
    } catch {
      toast.error('Erreur lors de l\'envoi');
    } finally {
      setContactSending(false);
    }
  };

  const resetContactForm = () => {
    setContactSuccess(null);
    setContactErrors({});
    setContactForm({ name: '', email: '', subject: '', message: '' });
  };

  // ─── Admin Functions ─────────────────────────────────────────────
  const adminLogin = async () => {
    if (!adminEmail.trim() || !adminPassword.trim()) {
      setAdminLoginError('L\'email et le mot de passe sont requis');
      return;
    }
    // Rate limiting check
    if (adminLoginLockedUntil && Date.now() < adminLoginLockedUntil) {
      const remaining = Math.ceil((adminLoginLockedUntil - Date.now()) / 1000);
      setAdminLoginError(`Trop de tentatives. Réessayez dans ${remaining}s`);
      return;
    }
    try {
      setAdminLoginLoading(true);
      setAdminLoginError('');
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: adminEmail, password: adminPassword }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAdminLoginAttempts(0);
        setAdminLoginLockedUntil(0);
        setIsAdminAuthenticated(true);
        setAdminToken(data.token);
        setAdminPassword('');
        toast.success('Authentification réussie');
        fetchAdminSettings();
        fetchAdminNotebooks(data.token);
        fetchAdminFeedbacks(data.token);
        fetchAdminChapters(data.token);
      } else {
        const newAttempts = adminLoginAttempts + 1;
        setAdminLoginAttempts(newAttempts);
        if (newAttempts >= 5) {
          setAdminLoginLockedUntil(Date.now() + 30000);
          setAdminLoginError('Trop de tentatives. Réessayez dans 30 secondes');
        } else {
          setAdminLoginError(data.error || 'Mot de passe incorrect');
        }
      }
    } catch {
      setAdminLoginError('Erreur de connexion');
    } finally {
      setAdminLoginLoading(false);
    }
  };

  const adminLogout = () => {
    setIsAdminAuthenticated(false);
    setAdminToken('');
    setAdminEmail('');
    setAdminPassword('');
    setAdminNotebooks([]);
    setAdminFeedbacks([]);
    setAdminChapters([]);
    setExpandedFeedback(null);
    setAdminLoginAttempts(0);
    setAdminLoginLockedUntil(0);
    toast.info('Déconnexion effectuée');
  };

  const fetchAdminNotebooks = useCallback(async (token?: string) => {
    const t = token || adminToken;
    try {
      const res = await fetch('/api/notebooks', {
        headers: { 'Authorization': `Bearer ${t}` },
      });
      if (res.ok) {
        const data = await res.json();
        setAdminNotebooks(data);
      }
    } catch {
      // silent
    }
  }, [adminToken]);

  const fetchAdminFeedbacks = useCallback(async (token?: string) => {
    const t = token || adminToken;
    try {
      const res = await fetch('/api/feedback', {
        headers: { 'Authorization': `Bearer ${t}` },
      });
      if (res.ok) {
        const data = await res.json();
        setAdminFeedbacks(data);
      }
    } catch {
      // silent
    }
  }, [adminToken]);

  const uploadNotebook = async () => {
    if (!adminNewNotebook.file || !adminNewNotebook.title.trim()) {
      toast.error('Le titre et le fichier sont requis');
      return;
    }
    try {
      setAdminUploading(true);
      const formData = new FormData();
      formData.append('file', adminNewNotebook.file);
      formData.append('title', adminNewNotebook.title.trim());
      formData.append('description', adminNewNotebook.description.trim());
      formData.append('chapter', adminNewNotebook.chapter);
      formData.append('visible', adminNewNotebook.visible);

      const res = await fetch('/api/notebooks', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${adminToken}` },
        body: formData,
      });

      if (res.ok) {
        toast.success('Notebook téléchargé avec succès');
        setAdminNewNotebook({ title: '', description: '', chapter: '', visible: 'true', file: null });
        fetchAdminNotebooks();
      } else {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error || 'Erreur lors du téléchargement');
      }
    } catch {
      toast.error('Erreur lors du téléchargement');
    } finally {
      setAdminUploading(false);
    }
  };

  // ─── Admin Settings Functions ──────────────────────────────────
  const fetchAdminSettings = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/settings');
      if (res.ok) {
        const data = await res.json();
        setAdminSettings(prev => ({
          ...prev,
          notifyEmail: data.notifyEmail ?? '',
          smtpHost: data.smtpHost ?? '',
          smtpPort: data.smtpPort ?? 587,
          smtpUser: data.smtpUser ?? '',
          smtpPass: data.hasSmtpPass ? '••••••••' : '',
          notifyOnCreate: data.notifyOnCreate ?? true,
          notifyOnUpdate: data.notifyOnUpdate ?? true,
          notifyOnDelete: data.notifyOnDelete ?? true,
        }));
      }
    } catch { /* silent */ }
  }, []);

  const saveAdminSettings = async () => {
    try {
      setAdminSettingsLoading(true);
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
        body: JSON.stringify(adminSettings),
      });
      if (res.ok) {
        toast.success('Paramètres enregistrés');
        setAdminSettingsSaved(true);
        setTimeout(() => setAdminSettingsSaved(false), 3000);
      } else {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error || 'Erreur');
      }
    } catch { toast.error('Erreur de connexion'); }
    finally { setAdminSettingsLoading(false); }
  };

  const sendTestEmail = async () => {
    if (!adminSettings.notifyEmail) { toast.error('Adresse email requise'); return; }
    try {
      setTestEmailLoading(true);
      const res = await fetch('/api/admin/notify', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
        body: JSON.stringify({
          notifyEmail: adminSettings.notifyEmail,
          smtpHost: adminSettings.smtpHost,
          smtpPort: adminSettings.smtpPort,
          smtpUser: adminSettings.smtpUser,
          smtpPass: adminSettings.smtpPass,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (data.success) { toast.success(data.message); }
      else { toast.error(data.error || 'Erreur'); }
    } catch { toast.error('Erreur de connexion'); }
    finally { setTestEmailLoading(false); }
  };

  // ─── Course Chapters Admin Functions ──────────────────────────────
  const fetchAdminChapters = useCallback(async (token?: string) => {
    const t = token || adminToken;
    try {
      const res = await fetch('/api/chapters', {
        headers: { Authorization: `Bearer ${t}` },
      });
      if (res.ok) {
        const data = await res.json();
        setAdminChapters(data);
      }
    } catch (error) {
      console.error('Failed to fetch chapters:', error);
    }
  }, [adminToken]);

  const fetchPublicChapters = useCallback(async () => {
    try {
      const res = await fetch('/api/chapters');
      if (res.ok) {
        const data = await res.json();
        setPublicChapters(data);
      }
    } catch (error) {
      console.error('Failed to fetch public chapters:', error);
    }
  }, []);

  useEffect(() => {
    fetchPublicChapters();
  }, [fetchPublicChapters]);

  const addChapter = async () => {
    if (!adminNewChapter.title.trim()) {
      toast.error('Le titre est obligatoire');
      return;
    }
    try {
      const res = await fetch('/api/chapters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
        body: JSON.stringify(adminNewChapter),
      });
      if (res.ok) {
        toast.success('Chapitre ajouté avec succès');
        setAdminNewChapter({ title: '', description: '', type: 'chapter', content: '', sectionId: '', order: 0 });
        fetchAdminChapters();
      } else {
        toast.error('Erreur lors de l\'ajout du chapitre');
      }
    } catch {
      toast.error('Erreur lors de l\'ajout du chapitre');
    }
  };

  const deleteChapter = async (id: string) => {
    try {
      const res = await fetch(`/api/chapters/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      if (res.ok) {
        toast.success('Chapitre supprimé');
        fetchAdminChapters();
      }
    } catch {
      toast.error('Erreur lors de la suppression');
    }
  };

  const uploadChapterNotebook = async () => {
    if (!adminChapterNotebookFile || !selectedChapterForNotebook) {
      toast.error('Fichier et chapitre requis');
      return;
    }
    setAdminChapterUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', adminChapterNotebookFile);
      formData.append('title', adminChapterNotebookFile.name.replace(/\.(ipynb|py|json)$/, ''));
      formData.append('chapterId', selectedChapterForNotebook);
      formData.append('visible', 'true');
      formData.append('colabUrl', adminChapterNotebookColabUrl);

      const res = await fetch('/api/chapter-notebooks', {
        method: 'POST',
        headers: { Authorization: `Bearer ${adminToken}` },
        body: formData,
      });
      if (res.ok) {
        toast.success('Notebook ajouté au chapitre');
        setAdminChapterNotebookFile(null);
        setAdminChapterNotebookColabUrl('');
        fetchAdminChapters();
      } else {
        toast.error('Erreur lors de l\'ajout du notebook');
      }
    } catch {
      toast.error('Erreur lors de l\'ajout du notebook');
    } finally {
      setAdminChapterUploading(false);
    }
  };

  const deleteChapterNotebook = async (id: string) => {
    try {
      const res = await fetch(`/api/chapter-notebooks/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      if (res.ok) {
        toast.success('Notebook supprimé');
        fetchAdminChapters();
      }
    } catch {
      toast.error('Erreur lors de la suppression');
    }
  };

  // Upload notebook for a specific TP
  const uploadTpNotebook = async (tpId: string) => {
    if (!tpNotebookUpload) { toast.error('Fichier requis'); return; }
    try {
      setTpNotebookUploading(true);
      const formData = new FormData();
      formData.append('file', tpNotebookUpload);
      formData.append('title', tpNotebookUpload.name.replace(/\.(ipynb|py|json)$/, ''));
      formData.append('tpId', tpId);
      formData.append('visible', 'true');
      const res = await fetch('/api/notebooks', {
        method: 'POST',
        headers: { Authorization: `Bearer ${adminToken}` },
        body: formData,
      });
      if (res.ok) {
        toast.success('Notebook ajouté au TP');
        setTpNotebookUpload(null);
        fetchTps();
      } else {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error || 'Erreur');
      }
    } catch { toast.error('Erreur'); }
    finally { setTpNotebookUploading(false); }
  };

  const toggleNotebookVisibility = async (id: string, currentVisible: boolean) => {
    try {
      const res = await fetch(`/api/notebooks/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ visible: !currentVisible }),
      });
      if (res.ok) {
        setAdminNotebooks(prev => prev.map(n => n.id === id ? { ...n, visible: !currentVisible } : n));
        toast.success(currentVisible ? 'Notebook masqué' : 'Notebook rendu visible');
      }
    } catch {
      toast.error('Erreur lors de la modification');
    }
  };

  const deleteNotebook = async (id: string) => {
    try {
      const res = await fetch(`/api/notebooks/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${adminToken}` },
      });
      if (res.ok) {
        setAdminNotebooks(prev => prev.filter(n => n.id !== id));
        toast.success('Notebook supprimé');
      }
    } catch {
      toast.error('Erreur lors de la suppression');
    }
  };

  const markFeedbackRead = async (id: string, read: boolean) => {
    try {
      const res = await fetch('/api/feedback', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, read }),
      });
      if (res.ok) {
        setAdminFeedbacks(prev => prev.map(f => f.id === id ? { ...f, read } : f));
      }
    } catch {
      // silent
    }
  };

  const deleteFeedback = async (id: string) => {
    try {
      const res = await fetch(`/api/feedback?id=${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${adminToken}` },
      });
      if (res.ok) {
        setAdminFeedbacks(prev => prev.filter(f => f.id !== id));
        if (expandedFeedback === id) setExpandedFeedback(null);
        toast.success('Message supprimé');
      }
    } catch {
      toast.error('Erreur lors de la suppression');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} o`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
  };

  // Export all progress as JSON
  const exportAllProgress = () => {
    try {
      const storedProgress = typeof window !== 'undefined' ? localStorage.getItem('ml-academy-progress') : null;
      const storedStreak = typeof window !== 'undefined' ? localStorage.getItem('ml-academy-streak') : null;
      const storedAchievements = typeof window !== 'undefined' ? localStorage.getItem('ml-academy-achievements') : null;

      const exportData = {
        formatVersion: '1.0',
        exportDate: new Date().toISOString(),
        completedSections: storedProgress ? JSON.parse(storedProgress) : completedSections,
        quizScores,
        chapterNotes,
        bookmarkedTps,
        studyTimeSeconds: totalStudyTime,
        streak: storedStreak ? JSON.parse(storedStreak) : streak,
        achievements: storedAchievements ? JSON.parse(storedAchievements) : unlockedAchievements,
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'ia-academy-progress-export.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Progression exportée avec succès !');
    } catch {
      toast.error("Erreur lors de l'export de la progression");
    }
  };

  // Import TPs from JSON file
  const importTps = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text);

      if (!Array.isArray(data)) {
        toast.error('Le fichier JSON doit contenir un tableau de TPs');
        return;
      }

      let importedCount = 0;
      for (const item of data) {
        if (!item.title || !item.description) {
          toast.error('Chaque TP doit avoir un titre et une description');
          return;
        }

        const res = await fetch('/api/tps', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: item.title,
            description: item.description,
            category: item.category || 'Classification',
            difficulty: item.difficulty || 'Débutant',
            duration: item.duration || '30 min',
            color: item.color || '#6366f1',
            colabUrl: item.colabUrl || '',
            kaggleUrl: item.kaggleUrl || '',
            datasetName: item.datasetName || '',
            datasetRows: item.datasetRows || '',
            datasetCols: item.datasetCols || '',
            objective: item.objective || '',
            expectedResult: item.expectedResult || '',
            steps: item.steps || [],
            concepts: item.concepts || [],
            tags: item.tags || '',
            order: tps.length + importedCount + 1,
          }),
        });

        if (res.ok) {
          importedCount++;
        }
      }

      if (importedCount > 0) {
        toast.success(`${importedCount} TP(s) importés avec succès`);
        fetchTps();
      }
    } catch {
      toast.error('Le fichier JSON est invalide');
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Chapter navigation handlers
  const handleChapterChange = useCallback((sectionId: CourseSectionId) => {
    const prev = prevCourseRef.current;
    if (prev !== sectionId) {
      setCompletedSections(prevList => {
        if (!prevList.includes(prev)) {
          return [...prevList, prev];
        }
        return prevList;
      });
    }
    // Track opened chapters for achievements
    setOpenedChapters(prev => prev.includes(sectionId) ? prev : [...prev, sectionId]);
    prevCourseRef.current = sectionId;
    setActiveCourse(sectionId);
  }, []);

  const toggleSectionCompletion = (sectionId: CourseSectionId, e: React.MouseEvent) => {
    e.stopPropagation();
    const isCompleting = !completedSections.includes(sectionId);
    const newCompleted = isCompleting
      ? [...completedSections, sectionId]
      : completedSections.filter(id => id !== sectionId);
    setCompletedSections(newCompleted);
    markAsStudied();
    if (isCompleting) {
      const chapter = courseSections.find(s => s.id === sectionId);
      if (chapter) {
        addActivity('Chapitre complété', chapter.title, 'BookOpen');
      }
    }
    setTimeout(() => checkAchievements({
      completedSections: newCompleted,
      quizVerified,
      quizScores,
      chapterNotes,
      bookmarkedTps,
    }), 500);
  };

  // Computed values for course navigation
  const currentChapterIndex = courseSections.findIndex(s => s.id === activeCourse);
  const prevChapter = currentChapterIndex > 0 ? courseSections[currentChapterIndex - 1] : null;
  const nextChapter = currentChapterIndex < courseSections.length - 1 ? courseSections[currentChapterIndex + 1] : null;

  // Tab config
  const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
    { id: 'accueil', label: 'Accueil', icon: <GraduationCap className="w-4 h-4" /> },
    { id: 'cours', label: 'Cours', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'tps', label: 'TPs', icon: <FlaskConical className="w-4 h-4" /> },
    { id: 'contact', label: 'Contact', icon: <Mail className="w-4 h-4" /> },
    { id: 'admin', label: 'Admin', icon: <span className="relative"><Shield className="w-4 h-4 text-amber-400" />{!isAdminAuthenticated && <Lock className="w-2.5 h-2.5 text-amber-400 absolute -bottom-1 -right-1" />}</span> },
  ];

  const switchTab = (tabId: TabId) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    try {
      window.location.hash = tabId;
    } catch {
      // SSR safety
    }
    // Track visited tabs for achievements
    setVisitedTabs(prev => prev.includes(tabId) ? prev : [...prev, tabId]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* ─── Scroll Progress Bar ─────────────────────────────── */}
      <div className="fixed top-0 left-0 right-0 z-[200] h-[3px]">
        <motion.div
          className="h-full bg-gradient-to-r from-primary via-purple-500 to-amber-500"
          style={{ width: `${scrollProgress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>

      {/* ─── Stats Bar (above navbar) ─────────────────────────── */}
      <AnimatePresence>
        {hasProgress && showStatsBar && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden z-[51] relative"
          >
            <div className={`stats-bar-gradient bg-secondary/60 backdrop-blur-md border-b border-border/50 ${theme === 'light' ? 'border-b' : 'border-gradient-to-r from-primary/20 via-purple-500/20 to-amber-500/20'}`}>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5 flex items-center justify-center gap-4 sm:gap-6 text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <span className="dot-indicator sm emerald" />
                  En ligne
                </span>
                <span className="hidden sm:inline w-px h-3 bg-border" />
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3 h-3 text-primary-foreground" />
                  {Math.floor(totalStudyTime / 3600) > 0 && `${Math.floor(totalStudyTime / 3600)}h `}
                  {Math.floor((totalStudyTime % 3600) / 60)}m {totalStudyTime % 60}s d&apos;étude
                </span>
                <span className="hidden sm:inline w-px h-3 bg-border" />
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  {completedSections.length}/8 cours complétés
                </span>
                <span className="hidden sm:inline w-px h-3 bg-border" />
                <span className="flex items-center gap-1.5">
                  <Brain className="w-3 h-3 text-amber-400" />
                  Quiz : {totalQuizScore}/{totalQuizQuestions}
                </span>
                <span className="hidden sm:inline w-px h-3 bg-border" />
                <span className="flex items-center gap-1.5">
                  <Bookmark className="w-3 h-3 text-amber-400" />
                  {bookmarkedTps.length} TP(s) favoris
                </span>
                {unlockedAchievements.length > 0 && (
                  <>
                    <span className="hidden sm:inline w-px h-3 bg-border" />
                    <button
                      onClick={() => { switchTab('cours'); setTimeout(() => setShowAchievements(true), 300); }}
                      className="flex items-center gap-1.5 hover:text-foreground transition-colors neon-text emerald"
                    >
                      <Award className="w-3 h-3 text-amber-400" />
                      {unlockedAchievements.length}/{achievementDefs.length} succès
                    </button>
                  </>
                )}
                {streak.currentStreak > 0 && (
                  <>
                    <span className="hidden sm:inline w-px h-3 bg-border" />
                      <span className="streak-badge">
                      <Flame className="w-3 h-3" />
                      {streak.currentStreak} jours d&apos;affilée
                    </span>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Navigation Bar ─────────────────────────────────── */}
      <header className="sticky top-0 z-50 glass-card border-b border-border/50 hover-border-glow indigo">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg gradient-text">IA Academy</span>
            </div>

            {/* Desktop Tabs */}
            <div className="hidden md:flex items-center gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => switchTab(tab.id)}
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'text-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                  }`}
                  aria-current={activeTab === tab.id ? 'page' : undefined}
                >
                  {tab.icon}
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-primary to-purple-500 rounded-full pulse-ring"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="hidden sm:flex items-center gap-1.5 text-xs">
                <Zap className="w-3 h-3 text-amber-400" />
                Google Colab Ready
              </Badge>

              {/* Command palette trigger */}
              <button
                onClick={() => { setCommandPaletteOpen(true); setCommandSearch(''); setSelectedCommandIndex(0); }}
                className="hidden sm:flex items-center gap-1.5 rounded-md border border-border bg-secondary/50 px-2.5 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                aria-label="Ouvrir la palette de commandes"
              >
                <Search className="w-3 h-3" />
                <span className="hidden lg:inline">Rechercher...</span>
                <kbd className="ml-2 flex items-center gap-0.5 rounded border border-border bg-background px-1 py-0.5 text-[10px] font-mono">
                  <Command className="w-2.5 h-2.5" />K
                </kbd>
              </button>

              {/* Theme toggle (desktop) */}
              <button
                onClick={toggleTheme}
                className="hidden lg:flex items-center justify-center w-8 h-8 rounded-md border border-border bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-300"
                aria-label={theme === 'dark' ? 'Activer le mode clair' : 'Activer le mode sombre'}
              >
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              {/* Timer toggle (desktop) */}
              <button
                onClick={() => setShowStudyTimer(prev => !prev)}
                className="hidden lg:flex items-center justify-center w-8 h-8 rounded-md border border-border bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors relative"
                aria-label={showStudyTimer ? 'Masquer le minuteur' : 'Afficher le minuteur'}
              >
                <Timer className="w-4 h-4" />
                {streak.currentStreak > 0 && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center w-3.5 h-3.5 rounded-full bg-orange-500 text-[7px] font-bold text-white">
                    {streak.currentStreak}
                  </span>
                )}
              </button>

              {/* Shortcuts help button (desktop) */}
              <button
                onClick={() => setShowShortcuts(prev => !prev)}
                className="hidden lg:flex items-center justify-center w-8 h-8 rounded-md border border-border bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                aria-label="Raccourcis clavier"
              >
                <HelpCircle className="w-4 h-4" />
              </button>

              {/* Mobile hamburger */}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-72">
                  <SheetHeader>
                    <SheetTitle className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center">
                        <Brain className="w-4 h-4 text-white" />
                      </div>
                      IA Academy
                    </SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 space-y-2">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => switchTab(tab.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                          activeTab === tab.id
                            ? 'bg-primary/10 text-primary-foreground border border-primary/20'
                            : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
                        }`}
                        aria-current={activeTab === tab.id ? 'page' : undefined}
                      >
                        {tab.icon}
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </nav>
      </header>

      {/* ─── Onboarding Overlay ──────────────────────────── */}
      <AnimatePresence>
        {showOnboarding && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm"
          >
            <motion.div
              key={onboardingStep}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              transition={{ duration: 0.3 }}
              className="onboarding-card glass-card p-8 sm:p-10 max-w-md w-full mx-4 text-center space-y-6"
            >
              {onboardingStep === 0 && (
                <>
                  <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center">
                    <Brain className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold gradient-text">Bienvenue sur IA Academy !</h2>
                  <p className="text-muted-foreground">Votre plateforme complète pour apprendre le Machine Learning par la pratique. Explorez des cours interactifs et des travaux pratiques concrets.</p>
                </>
              )}
              {onboardingStep === 1 && (
                <>
                  <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                    <BookOpen className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold gradient-text">Cours Interactifs</h2>
                  <p className="text-muted-foreground">8 chapitres détaillés couvrant les fondamentaux du ML au Deep Learning, avec des quiz, des notes et un glossaire intégré.</p>
                </>
              )}
              {onboardingStep === 2 && (
                <>
                  <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                    <FlaskConical className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold gradient-text">Travaux Pratiques</h2>
                  <p className="text-muted-foreground">4 TPs complets sur des datasets réels avec filtres, favoris, export JSON et un minuteur Pomodoro pour rester concentré.</p>
                </>
              )}
              {onboardingStep === 3 && (
                <>
                  <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center">
                    <Rocket className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gradient-scroll">Prêt à commencer ?</h2>
                  <p className="text-muted-foreground">Explorez les cours et TPs à votre rythme. Utilisez Ctrl+K pour naviguer rapidement.</p>
                </>
              )}
              {/* Step dots */}
              <div className="flex justify-center gap-2">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className={`step-dot w-2 h-2 rounded-full transition-all duration-300 ${i === onboardingStep ? 'active' : 'inactive'}`} />
                ))}
              </div>
              {/* Navigation buttons */}
              <div className="flex items-center justify-between gap-4">
                {onboardingStep > 0 ? (
                  <Button variant="outline" onClick={() => setOnboardingStep(prev => prev - 1)}>Précédent</Button>
                ) : (
                  <Button variant="ghost" onClick={() => { setShowOnboarding(false); try { localStorage.setItem('ml-academy-onboarded', 'true'); } catch {} }}>Passer</Button>
                )}
                {onboardingStep < 3 ? (
                  <Button onClick={() => setOnboardingStep(prev => prev + 1)} className="bg-gradient-to-r from-primary to-purple-500 text-white">
                    Suivant <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                ) : (
                  <Button onClick={() => { setShowOnboarding(false); try { localStorage.setItem('ml-academy-onboarded', 'true'); } catch {} }} className="bg-gradient-to-r from-primary to-purple-500 text-white">
                    Commencer <Sparkles className="w-4 h-4 ml-1" />
                  </Button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Main Content ───────────────────────────────────── */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          {/* ═══════ ACCUEIL TAB ═══════ */}
          {activeTab === 'accueil' && (
            <motion.div
              key="accueil"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Hero Section */}
              <section className="noise-bg particle-bg aurora-bg relative py-20 sm:py-28 lg:py-36">
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                  <div className="floating-orbs"></div>
                  <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                    <Badge variant="outline" className="mb-6 text-xs border-primary/30 text-primary-foreground badge-pulse animate-pulse-soft">
                      <Sparkles className="w-3 h-3 mr-1" /> Formation IA Machine Learning — 2025/2026
                    </Badge>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight text-shadow-soft">
                      Maîtrisez le{' '}
                      <span className="gradient-text text-gradient-static indigo-purple text-shadow-neon indigo">Machine Learning</span>
                      <br />
                      par la pratique
                    </h1>
                    <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed hero-subtitle text-shadow-soft">
                      Une formation complète avec des cours interactifs, des travaux pratiques concrets
                      et des projets réels pour devenir autonome en ML et Deep Learning.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                      <Button
                        size="lg"
                        onClick={() => switchTab('cours')}
                        className="bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90 text-white px-8"
                      >
                        <BookOpen className="w-4 h-4 mr-2" />
                        Commencer la formation
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                      <Button
                        size="lg"
                        variant="outline"
                        onClick={() => switchTab('tps')}
                        className="border-border hover:bg-secondary"
                      >
                        <FlaskConical className="w-4 h-4 mr-2" />
                        Voir les TPs
                      </Button>
                    </div>
                    {/* Scroll indicator */}
                    <div className="scroll-indicator mt-8">
                      <div className="dot" />
                      <div className="dot" />
                      <div className="dot" />
                    </div>
                  </motion.div>

                  {/* Animated Stats */}
                  <motion.div
                    className="mt-16 grid grid-cols-3 gap-4 sm:gap-8 max-w-xl mx-auto"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    {[
                      { target: 8, suffix: '+', label: 'Algorithmes', icon: <Cpu className="w-5 h-5" /> },
                      { target: 4, suffix: '', label: 'TPs Complets', icon: <FlaskConical className="w-5 h-5" /> },
                      { target: 4, suffix: '', label: 'Datasets Réels', icon: <Database className="w-5 h-5" /> },
                    ].map((stat, i) => (
                      <motion.div
                        key={stat.label}
                        className="glass-card card-spotlight-hover hover-glow-border hover-glow-sm hover-scale-sm rounded-xl p-4 text-center animate-float"
                        whileHover={{ scale: 1.05 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + i * 0.1 }}
                      >
                        <div className="flex justify-center mb-2 text-primary-foreground">
                          {stat.icon}
                        </div>
                        <div className="text-2xl sm:text-3xl font-bold gradient-text stat-highlight">
                          <AnimatedCounter target={stat.target} suffix={stat.suffix} duration={1.5 + i * 0.2} delay={800 + i * 200} />
                        </div>
                        <span className="glass-badge-3d text-xs sm:text-sm text-muted-foreground mt-1 inline-block">{stat.label}</span>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              </section>

              <div className="gradient-divider indigo max-w-7xl mx-auto" />

              {/* ── Astuce du Jour ── */}
              <section className="py-12 sm:py-16">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="glass-morphism-card rounded-2xl p-6 sm:p-8 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500/60 via-primary/60 to-purple-500/60" />
                    <div className="flex items-center gap-3 mb-5">
                      <Lightbulb className="w-6 h-6 text-amber-400" />
                      <h2 className="text-xl sm:text-2xl font-bold gradient-text-warm">Astuce du Jour</h2>
                    </div>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={tipKey}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.25 }}
                        className="space-y-4"
                      >
                        {(() => {
                          const tipIdx = (Math.floor(Date.now() / 86400000) % tipsData.length + tipOffset) % tipsData.length;
                          const currentTip = tipsData[tipIdx];
                          return (
                            <>
                              <Badge
                                variant="outline"
                                className={`text-xs border ${tipCategoryColors[currentTip.category]}`}
                              >
                                {currentTip.category}
                              </Badge>
                              <p className="text-base sm:text-lg text-muted-foreground italic leading-relaxed">
                                &ldquo;{currentTip.text}&rdquo;
                              </p>
                            </>
                          );
                        })()}
                      </motion.div>
                    </AnimatePresence>
                    <div className="mt-5 flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        Astuce {(Math.floor(Date.now() / 86400000) % tipsData.length + tipOffset) % tipsData.length + 1}/{tipsData.length}
                      </span>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setTipOffset((prev) => (prev - 1 + tipsData.length) % tipsData.length);
                            setTipKey((prev) => prev + 1);
                          }}
                          className="text-muted-foreground hover:text-foreground gap-1.5 text-sm"
                        >
                          <ChevronLeft className="w-3.5 h-3.5" />
                          Astuce précédente
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setTipOffset((prev) => (prev + 1) % tipsData.length);
                            setTipKey((prev) => prev + 1);
                          }}
                          className="text-muted-foreground hover:text-foreground gap-1.5 text-sm"
                        >
                          Astuce suivante
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* ── Challenge du Jour ── */}
              <section className="py-12 sm:py-16">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="glass-morphism-card rounded-2xl p-6 sm:p-8 relative overflow-hidden animate-border-glow">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500/60 via-red-500/60 to-purple-500/60" />
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center gap-3">
                        <Compass className="w-6 h-6 text-primary-foreground" />
                        <h2 className="text-xl sm:text-2xl font-bold gradient-text">Défi du Jour</h2>
                      </div>
                      <Badge variant="outline" className="text-xs border-border text-muted-foreground">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                      </Badge>
                    </div>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={challengeKey}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.25 }}
                        className="space-y-4"
                      >
                        {(() => {
                          const todayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
                          const challengeIdx = (todayOfYear % dailyChallenges.length + challengeNavOffset) % dailyChallenges.length;
                          const challenge = dailyChallenges[challengeIdx];
                          const challengeId = `challenge-${challengeIdx}`;
                          const isCompleted = completedDailyChallenges.includes(challengeId);
                          return (
                            <>
                              <div className="flex flex-wrap items-center gap-2">
                                <Badge variant="outline" className={`text-xs border ${challengeDifficultyColors[challenge.difficulty]}`}>
                                  {challenge.difficulty}
                                </Badge>
                                <Badge variant="outline" className="text-xs border border-border text-muted-foreground">
                                  <Clock className="w-3 h-3 mr-1" />
                                  {challenge.estimatedTime}
                                </Badge>
                                {isCompleted && (
                                  <Badge className="text-xs bg-emerald-500/15 text-emerald-400 border-emerald-500/30">
                                    <Check className="w-3 h-3 mr-1" />
                                    Complété
                                  </Badge>
                                )}
                              </div>
                              <h3 className="text-lg font-semibold text-foreground">{challenge.title}</h3>
                              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{challenge.description}</p>
                              <div className="pt-2">
                                <button
                                  onClick={() => { switchTab('cours'); setTimeout(() => handleChapterChange(challenge.relatedChapter), 300); }}
                                  className="inline-flex items-center gap-1.5 text-sm text-primary-foreground hover:text-foreground transition-colors"
                                >
                                  <BookOpen className="w-3.5 h-3.5" />
                                  Chapitre lié : {challenge.chapterLabel}
                                  <ChevronRight className="w-3 h-3" />
                                </button>
                              </div>
                            </>
                          );
                        })()}
                      </motion.div>
                    </AnimatePresence>
                    <div className="mt-5 flex items-center justify-between">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const todayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
                          const challengeIdx = (todayOfYear % dailyChallenges.length + challengeNavOffset) % dailyChallenges.length;
                          const challengeId = `challenge-${challengeIdx}`;
                          setCompletedDailyChallenges(prev =>
                            prev.includes(challengeId) ? prev.filter(id => id !== challengeId) : [...prev, challengeId]
                          );
                        }}
                        className="text-muted-foreground hover:text-foreground gap-1.5 text-sm"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {(() => {
                          const todayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
                          const challengeIdx = (todayOfYear % dailyChallenges.length + challengeNavOffset) % dailyChallenges.length;
                          const challengeId = `challenge-${challengeIdx}`;
                          return completedDailyChallenges.includes(challengeId) ? 'Marquer incomplet' : 'Marquer comme complété';
                        })()}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setChallengeNavOffset(prev => (prev + 1) % dailyChallenges.length);
                          setChallengeKey(prev => prev + 1);
                        }}
                        className="text-muted-foreground hover:text-foreground gap-1.5 text-sm"
                      >
                        Défi suivant
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </section>

              {/* Features Section */}
              <section className="py-20 sm:py-24 dot-pattern-bg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="text-center mb-14">
                    <h2 className="text-3xl sm:text-4xl font-bold mb-4 shimmer-text text-balance">Ce que vous allez apprendre</h2>
                    <hr className="glass-divider-gradient" />
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                      Un programme complet couvrant les fondamentaux du Machine Learning
                      jusqu&apos;au Deep Learning et aux séries temporelles.
                    </p>
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger-grid stagger-children">
                    {[
                      {
                        icon: <Database className="w-6 h-6 icon-float icon-bounce-hover" />,
                        title: 'Prétraitement des Données',
                        desc: "Nettoyage, imputation, normalisation, encodage et feature engineering.",
                        color: 'from-blue-500 to-cyan-500',
                      },
                      {
                        icon: <Cpu className="w-6 h-6 icon-float icon-bounce-hover" />,
                        title: 'Algorithmes ML',
                        desc: 'Régression linéaire, logistique, Random Forest, SVM, KNN et plus.',
                        color: 'from-purple-500 to-pink-500',
                      },
                      {
                        icon: <BarChart3 className="w-6 h-6 icon-float icon-bounce-hover" />,
                        title: 'Évaluation des Modèles',
                        desc: 'Accuracy, F1-Score, ROC-AUC, Cross-validation, Grid Search.',
                        color: 'from-amber-500 to-orange-500',
                      },
                      {
                        icon: <Rocket className="w-6 h-6 icon-float icon-bounce-hover" />,
                        title: 'Projets Concrets',
                        desc: 'Titanic, House Prices, Iris, et prédiction énergétique avec LSTM.',
                        color: 'from-emerald-500 to-teal-500',
                      },
                      {
                        icon: <Activity className="w-6 h-6 icon-float icon-bounce-hover" />,
                        title: 'Séries Temporelles',
                        desc: 'LSTM, fenêtres glissantes, feature engineering temporel.',
                        color: 'from-red-500 to-rose-500',
                      },
                      {
                        icon: <Layers className="w-6 h-6 icon-float icon-bounce-hover" />,
                        title: 'Deep Learning',
                        desc: 'Réseaux de neurones, activation functions, dropout, régularisation.',
                        color: 'from-violet-500 to-purple-500',
                      },
                    ].map((feature, i) => (
                      <motion.div
                        key={feature.title}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <Card className="glass-card card-hover-shine card-gradient-top indigo h-full hover:glow transition-shadow duration-300 group cursor-default">
                          <CardHeader>
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
                              <div className="text-white">{feature.icon}</div>
                            </div>
                            <CardTitle className="text-lg">{feature.title}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <CardDescription className="text-sm leading-relaxed">{feature.desc}</CardDescription>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </section>

              <div className="glow-line-animated max-w-7xl mx-auto" />

              {/* Modules Section */}
              <section className="py-20 sm:py-24 bg-secondary/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="text-center mb-14">
                    <h2 className="text-3xl sm:text-4xl font-bold mb-4 shimmer-text text-balance">Modules de Formation</h2>
                    <p className="text-muted-foreground">Trois modules complémentaires pour une formation complète</p>
                  </div>
                  <div className="grid md:grid-cols-3 gap-6 stagger-children">
                    {[
                      {
                        icon: <BookOpen className="w-8 h-8" />,
                        title: 'Cours Théoriques',
                        desc: '8 chapitres détaillés couvrant les fondamentaux du ML au Deep Learning avec des exemples de code Python.',
                        tab: 'cours' as TabId,
                        color: 'from-primary to-purple-500',
                      },
                      {
                        icon: <FlaskConical className="w-8 h-8" />,
                        title: 'Travaux Pratiques',
                        desc: '4 TPs complets sur des datasets réels : Titanic, House Prices, Iris, et séries temporelles LSTM.',
                        tab: 'tps' as TabId,
                        color: 'from-emerald-500 to-teal-500',
                      },
                      {
                        icon: <Send className="w-8 h-8" />,
                        title: 'Retour & Support',
                        desc: "Posez vos questions, envoyez votre feedback et améliorez votre expérience d'apprentissage.",
                        tab: 'contact' as TabId,
                        color: 'from-amber-500 to-orange-500',
                      },
                    ].map((mod) => (
                      <motion.div
                        key={mod.title}
                        whileHover={{ y: -4 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                      >
                        <Card
                          className="card-tilt glass-card hover-scale-smooth card-gradient-top card-spotlight h-full cursor-pointer hover:glow transition-all duration-300 hover-scale-sm"
                          onClick={() => switchTab(mod.tab)}
                        >
                          <CardHeader className="items-center text-center">
                            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${mod.color} flex items-center justify-center mb-3 text-white icon-float`}>
                              {mod.icon}
                            </div>
                            <CardTitle className="text-xl">{mod.title}</CardTitle>
                            <CardDescription className="text-sm leading-relaxed">{mod.desc}</CardDescription>
                          </CardHeader>
                          <CardFooter className="justify-center">
                            <Button variant="ghost" className="text-primary-foreground hover:bg-primary/10">
                              Accéder <ArrowRight className="w-4 h-4 ml-1" />
                            </Button>
                          </CardFooter>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Timeline Section */}
              <section className="py-20 sm:py-24">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="text-center mb-14">
                    <h2 className="text-3xl sm:text-4xl font-bold mb-4 shimmer-text text-balance">Parcours de Formation</h2>
                    <p className="text-muted-foreground">8 étapes pour maîtriser le Machine Learning</p>
                  </div>
                  <div className="relative">
                    <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-purple-500 to-amber-500" />
                    {[
                      { step: '01', title: 'Introduction au ML', desc: 'Découvrir les types d\'apprentissage et le pipeline ML' },
                      { step: '02', title: 'Régression Linéaire', desc: 'Premier modèle : prédire des valeurs continues' },
                      { step: '03', title: 'Régression Logistique', desc: 'Classification binaire avec la fonction sigmoïde' },
                      { step: '04', title: 'TP Titanic', desc: 'Premier TP complet sur un dataset classique Kaggle' },
                      { step: '05', title: 'Random Forest', desc: 'Algorithme d\'ensemble robuste et performant' },
                      { step: '06', title: 'Réseaux de Neurones', desc: 'Deep Learning avec Keras : couches, activations, dropout' },
                      { step: '07', title: 'LSTM & Séries Temporelles', desc: 'Prédiction de consommation énergétique avec LSTM' },
                      { step: '08', title: 'Projet Final', desc: 'Mettre en pratique toutes les compétences acquises' },
                    ].map((item, i) => (
                      <motion.div
                        key={item.step}
                        className={`relative flex items-start gap-4 sm:gap-8 mb-10 ${
                          i % 2 === 0 ? 'sm:flex-row' : 'sm:flex-row-reverse'
                        }`}
                        initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <div className="absolute left-4 sm:left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-xs font-bold text-white z-10">
                          {item.step}
                        </div>
                        <div className={`ml-14 sm:ml-0 sm:w-[calc(50%-2rem)] ${i % 2 === 0 ? 'sm:text-right' : 'sm:text-left'}`}>
                          <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                          <p className="text-sm text-muted-foreground">{item.desc}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </section>

              <div className="gradient-divider emerald max-w-4xl mx-auto" />

              {/* Ressources Section */}
              <section className="py-20 sm:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="text-center mb-14">
                    <h2 className="text-3xl sm:text-4xl font-bold mb-4 shimmer-text text-balance">Ressources Utiles</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                      Les outils et bibliothèques essentiels pour le Machine Learning et la Data Science.
                    </p>
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {resourceCategories.map((category) => (
                      <div key={category} className="col-span-full mb-2">
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                          <span className="dot-indicator sm emerald" />
                          {category}
                        </h3>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {resourcesData.filter(r => r.category === category).map((resource) => (
                            <motion.a
                              key={resource.name}
                              href={resource.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              initial={{ opacity: 0, y: 20 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.25 }}
                            >
                        <Card className="glass-card card-hover-border hover-card-lift hover-scale-sm h-full cursor-pointer group">
                                <CardHeader className="pb-2">
                                  <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                      <span className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center text-xs font-bold text-primary-foreground">{resource.icon}</span>
                                      <CardTitle className="text-sm font-semibold">{resource.name}</CardTitle>
                                    </div>
                                    <ExternalLink className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1" />
                                  </div>
                                </CardHeader>
                                <CardContent className="pt-0">
                                  <p className="text-xs text-muted-foreground leading-relaxed">{resource.description}</p>
                                </CardContent>
                              </Card>
                            </motion.a>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Dernières Nouvelles / Announcements Section */}
              <section className="py-20 sm:py-24">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="text-center mb-14">
                    <h2 className="text-3xl sm:text-4xl font-bold mb-4 shimmer-text text-balance">Dernieres Nouvelles</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                      Restez informé des dernières mises à jour et fonctionnalités de la plateforme.
                    </p>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                  >
                    <Card className="glass-card overflow-hidden">
                      <CardContent className="p-0">
                        <div className="divide-y divide-border/50">
                          {announcementsData.map((announcement, i) => {
                            const config = announcementTypeConfig[announcement.type];
                            const TypeIcon = config.icon;
                            return (
                              <motion.div
                                key={announcement.id}
                                className={`flex items-start gap-4 p-5 sm:p-6 border-l-4 ${config.borderClass} transition-colors hover:bg-secondary/20`}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.08, duration: 0.35 }}
                              >
                                <div className="shrink-0 mt-0.5">
                                  <div className="w-10 h-10 rounded-lg bg-secondary/80 border border-border/50 flex items-center justify-center">
                                    <TypeIcon className="w-5 h-5 text-foreground/70" />
                                  </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap mb-1">
                                    <h3 className="text-sm sm:text-base font-semibold">{announcement.title}</h3>
                                    <Badge variant="outline" className={`text-[10px] px-1.5 py-0 border ${config.badgeClass}`}>
                                      {config.label}
                                    </Badge>
                                  </div>
                                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{announcement.description}</p>
                                  <time className="text-xs text-muted-foreground/60 mt-2 block">
                                    {new Date(announcement.date).toLocaleDateString('fr-FR', {
                                      day: 'numeric',
                                      month: 'long',
                                      year: 'numeric',
                                    })}
                                  </time>
                                </div>
                              </motion.div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              </section>

              <div className="gradient-divider emerald max-w-4xl mx-auto" />

              {/* Certification Progress Section */}
              <section className="py-20 sm:py-24">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                  >
                    <Card className="glass-card-emerald glass-card card-hover-border overflow-hidden relative glass-card-animated">
                      {/* Subtle gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-purple-500/5 pointer-events-none" />

                      <CardHeader className="pb-4 relative">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                          <div className="flex items-center gap-3">
                            <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500/20 to-yellow-500/20 border border-amber-500/20">
                              <Trophy className="w-7 h-7 text-amber-400" />
                            </div>
                            <div>
                              <CardTitle className="text-xl sm:text-2xl font-bold">Certification IA</CardTitle>
                              <CardDescription className="text-sm text-muted-foreground mt-1">
                                Suivez votre progression vers le certificat de completion
                              </CardDescription>
                            </div>
                          </div>
                          <Badge className="glass-badge-3d bg-amber-500/10 text-amber-400 border border-amber-500/20 ml-auto shrink-0">
                            {(() => {
                              const chaptersPoints = completedSections.length * 10;
                              const quizzesPoints = completedQuizzes * 2.5;
                              const total = chaptersPoints + quizzesPoints;
                              return `${Math.round(total)}%`;
                            })()} complété
                          </Badge>
                        </div>
                      </CardHeader>

                      <CardContent className="relative">
                        <div className="flex flex-col md:flex-row items-center gap-8">
                          {/* Circular Progress Indicator */}
                          <div className="shrink-0 relative">
                            <svg width="160" height="160" viewBox="0 0 160 160" className="transform -rotate-90">
                              <circle cx="80" cy="80" r="68" fill="none" stroke="currentColor" strokeWidth="8" className="text-secondary/50" />
                              <motion.circle
                                cx="80" cy="80" r="68" fill="none"
                                stroke="url(#certGradient)"
                                strokeWidth="8"
                                strokeLinecap="round"
                                strokeDasharray={2 * Math.PI * 68}
                                initial={{ strokeDashoffset: 2 * Math.PI * 68 }}
                                whileInView={{
                                  strokeDashoffset: 2 * Math.PI * 68 * (1 - (() => {
                                    const cp = completedSections.length * 10;
                                    const qp = completedQuizzes * 2.5;
                                    return (cp + qp) / 100;
                                  })()),
                                }}
                                viewport={{ once: true }}
                                transition={{ duration: 1.5, ease: 'easeOut' }}
                              />
                              <defs>
                                <linearGradient id="certGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                  <stop offset="0%" stopColor="#f59e0b" />
                                  <stop offset="100%" stopColor="#a855f7" />
                                </linearGradient>
                              </defs>
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                              <span className="text-3xl font-bold tabular-nums">
                                {(() => {
                                  const cp = completedSections.length * 10;
                                  const qp = completedQuizzes * 2.5;
                                  return Math.round(cp + qp);
                                })()}
                              </span>
                              <span className="text-xs text-muted-foreground">/ 100 pts</span>
                            </div>
                          </div>

                          {/* Milestone Checklist */}
                          <div className="flex-1 w-full space-y-3">
                            {[
                              {
                                label: '8 chapitres de cours complétés',
                                current: completedSections.length,
                                target: 8,
                                points: `${completedSections.length * 10}/80 pts`,
                                done: completedSections.length >= 8,
                              },
                              {
                                label: '8 quizs réussis',
                                current: completedQuizzes,
                                target: 8,
                                points: `${(completedQuizzes * 2.5).toFixed(1)}/20 pts`,
                                done: completedQuizzes >= 8,
                              },
                              {
                                label: '50% de notes prises',
                                current: Object.values(chapterNotes).filter(n => n && n.trim().length > 0).length,
                                target: 4,
                                points: `${Object.values(chapterNotes).filter(n => n && n.trim().length > 0).length}/4 chapitres`,
                                done: Object.values(chapterNotes).filter(n => n && n.trim().length > 0).length >= 4,
                              },
                              {
                                label: '5 heures d\'étude minimum',
                                current: Math.floor(totalStudyTime / 3600),
                                target: 5,
                                points: `${Math.floor(totalStudyTime / 3600)}h ${Math.floor((totalStudyTime % 3600) / 60)}m`,
                                done: totalStudyTime >= 18000,
                              },
                            ].map((milestone) => (
                              <motion.div
                                key={milestone.label}
                                className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                                  milestone.done
                                    ? 'glass-chip emerald bg-emerald-500/10 border-emerald-500/20'
                                    : 'bg-secondary/30 border-border'
                                }`}
                                initial={{ opacity: 0, x: -10 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 }}
                              >
                                {milestone.done ? (
                                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                                ) : (
                                  <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/40 shrink-0" />
                                )}
                                <div className="flex-1 min-w-0">
                                  <p className={`text-sm font-medium ${milestone.done ? 'text-emerald-400' : ''}`}>
                                    {milestone.label}
                                  </p>
                                  <p className="text-xs text-muted-foreground">{milestone.points}</p>
                                </div>
                                <span className="text-xs text-muted-foreground shrink-0">
                                  {milestone.current}/{milestone.target}
                                </span>
                              </motion.div>
                            ))}
                          </div>
                        </div>

                        {/* Study Streak Calendar Widget */}
                        <motion.div
                          className="mt-6"
                          initial={{ opacity: 0, y: 15 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.4 }}
                        >
                          <div className="flex items-center gap-2 mb-3">
                            <Flame className="w-4 h-4 text-amber-400" />
                            <p className="text-sm font-semibold">Activite d&apos;etude (12 dernieres semaines)</p>
                          </div>
                          <div className="p-4 rounded-lg bg-secondary/20 border border-border/50">
                            {/* Day-of-week headers */}
                            <div className="grid grid-cols-[auto_repeat(7,1fr)] gap-1 mb-2">
                              <div />
                              {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(d => (
                                <div key={d} className="text-[10px] text-muted-foreground/60 text-center font-medium">{d}</div>
                              ))}
                            </div>
                            {/* Calendar grid */}
                            <div className="grid grid-cols-[auto_repeat(7,1fr)] gap-1">
                              {(() => {
                                const today = new Date();
                                const daysBack = 84; // 12 weeks
                                const startDate = new Date(today);
                                startDate.setDate(startDate.getDate() - daysBack);
                                // Align to Monday
                                const startDow = startDate.getDay(); // 0=Sun
                                const alignedDate = new Date(startDate);
                                alignedDate.setDate(alignedDate.getDate() - ((startDow + 6) % 7));

                                const cells: { date: string; seconds: number; isCurrent: boolean }[] = [];
                                const d = new Date(alignedDate);
                                while (cells.length < 84 + 7) { // enough to fill grid
                                  const dateStr = d.toISOString().slice(0, 10);
                                  const secs = dailyStudyTime[dateStr] || 0;
                                  cells.push({
                                    date: dateStr,
                                    seconds: secs,
                                    isCurrent: dateStr === today.toISOString().slice(0, 10),
                                  });
                                  d.setDate(d.getDate() + 1);
                                }

                                const weeks: typeof cells[] = [];
                                for (let w = 0; w < cells.length; w += 7) {
                                  weeks.push(cells.slice(w, w + 7));
                                }
                                // Remove the last week if it's all future
                                if (weeks.length > 12 && weeks[weeks.length - 1].every(c => c.date > today.toISOString().slice(0, 10))) {
                                  weeks.pop();
                                }

                                const getCellColor = (secs: number, dateStr: string) => {
                                  if (dateStr > today.toISOString().slice(0, 10)) return 'bg-transparent';
                                  if (secs === 0) return 'bg-secondary/40';
                                  const hours = secs / 3600;
                                  if (hours < 1) return 'bg-emerald-500/20';
                                  if (hours < 2) return 'bg-emerald-500/40';
                                  if (hours < 4) return 'bg-emerald-500/60';
                                  return 'bg-emerald-500/80';
                                };

                                const formatTooltip = (dateStr: string, secs: number) => {
                                  const formatted = new Date(dateStr).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
                                  const mins = Math.floor(secs / 60);
                                  const hrs = Math.floor(mins / 60);
                                  const remMins = mins % 60;
                                  const timeStr = hrs > 0 ? `${hrs}h ${remMins}m` : `${mins}m`;
                                  return `${formatted} - ${timeStr} d'etude`;
                                };

                                return weeks.map((week, wi) => (
                                  <div key={wi} className="contents">
                                    <div className="text-[10px] text-muted-foreground/40 flex items-center justify-end pr-1">
                                      {wi % 2 === 0 ? `S${Math.floor(wi / 2) + 1}` : ''}
                                    </div>
                                    {week.map(cell => (
                                      <div
                                        key={cell.date}
                                        className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-[3px] transition-colors ${getCellColor(cell.seconds, cell.date)} ${cell.isCurrent ? 'ring-1 ring-foreground/30' : ''}`}
                                        title={formatTooltip(cell.date, cell.seconds)}
                                      />
                                    ))}
                                  </div>
                                ));
                              })()}
                            </div>
                            {/* Legend */}
                            <div className="flex items-center gap-2 mt-3 text-[10px] text-muted-foreground/60">
                              <span>Moins</span>
                              <div className="w-3 h-3 rounded-[2px] bg-secondary/40" />
                              <div className="w-3 h-3 rounded-[2px] bg-emerald-500/20" />
                              <div className="w-3 h-3 rounded-[2px] bg-emerald-500/40" />
                              <div className="w-3 h-3 rounded-[2px] bg-emerald-500/60" />
                              <div className="w-3 h-3 rounded-[2px] bg-emerald-500/80" />
                              <span>Plus</span>
                            </div>
                          </div>
                        </motion.div>

                        {/* Congratulatory message when 100% */}
                        {(() => {
                          const cp = completedSections.length * 10;
                          const qp = completedQuizzes * 2.5;
                          const total = cp + qp;
                          const isComplete = total >= 100;
                          const certTimestamp = typeof window !== 'undefined' ? localStorage.getItem('ia-academy-cert-progress') : null;
                          if (isComplete && !certTimestamp) {
                            try { localStorage.setItem('ia-academy-cert-progress', new Date().toISOString()); } catch {}
                            setTimeout(() => triggerConfetti(), 500);
                          }
                          return isComplete ? (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="mt-6 p-4 rounded-lg bg-gradient-to-r from-amber-500/10 via-yellow-500/10 to-purple-500/10 border border-amber-500/20 text-center"
                            >
                              <Award className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                              <p className="text-lg font-bold bg-gradient-to-r from-amber-400 to-purple-400 bg-clip-text text-transparent">
                                Félicitations !
                              </p>
                              <p className="text-sm text-muted-foreground mt-1">
                                Vous avez atteint 100% de progression. Votre certification est validée !
                              </p>
                              {certTimestamp && (
                                <p className="text-xs text-muted-foreground/60 mt-2">
                                  Certifié depuis le {new Date(certTimestamp).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </p>
                              )}
                            </motion.div>
                          ) : null;
                        })()}
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              </section>

              <div className="glow-line-animated max-w-4xl mx-auto" />

              {/* CTA Section */}
              <section className="py-20 sm:py-24 bg-secondary/20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                  >
                    <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gradient-animated">
                      Prêt à commencer ?
                    </h2>
                    <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                      Lancez-vous dès maintenant dans l&apos;apprentissage du Machine Learning
                      avec nos cours interactifs et travaux pratiques.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 card-hover-bounce">
                      <Button
                        size="lg"
                        onClick={() => switchTab('cours')}
                        className="shimmer-border bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90 text-white px-8"
                      >
                        <Rocket className="w-4 h-4 mr-2" />
                        Démarrer la formation
                      </Button>
                      <Button size="lg" variant="outline" onClick={() => switchTab('tps')} className="border-border hover:bg-secondary">
                        Explorer les TPs
                      </Button>
                    </div>
                  </motion.div>
                </div>
              </section>
            </motion.div>
          )}

          {/* ═══════ COURS TAB ═══════ */}
          {activeTab === 'cours' && (
            <motion.div
              key="cours"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 grid-pattern relative dot-grid-bg"
            >
              <div className="mb-8">
                <h1 className="text-3xl sm:text-4xl font-bold mb-3">
                  <span className="gradient-text">Cours</span> de Machine Learning
                </h1>
                <p className="text-muted-foreground mb-3">
                  8 chapitres détaillés avec des explications, des formules et du code Python.
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 max-w-xs h-2 bg-secondary rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full animate-gradient-x"
                      initial={false}
                      animate={{ width: `${(completedSections.length / courseSections.length) * 100}%` }}
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {completedSections.length}/{courseSections.length} chapitres complétés
                  </span>
                </div>
              </div>

              <div className="flex flex-col lg:flex-row gap-6">
                {/* Sidebar Navigation */}
                <div className="lg:w-72 shrink-0">
                  <div className="glass-card glass-panel rounded-xl p-4 lg:sticky lg:top-24">
                    <h3 className="sidebar-section-title text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2">
                      Chapitres
                    </h3>
                    <ScrollArea className="max-h-[calc(100vh-200px)] lg:max-h-[70vh] scroll-shadow-top">
                      <div className="space-y-1">
                        {courseSections.map((section) => {
                          const isCompleted = completedSections.includes(section.id);
                          return (
                            <div
                              key={section.id}
                              onClick={() => handleChapterChange(section.id)}
                              role="button"
                              tabIndex={0}
                              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleChapterChange(section.id); }}
                              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 text-left cursor-pointer ${
                                activeCourse === section.id
                                  ? 'bg-primary/10 text-foreground border border-primary/20'
                                  : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
                              } ${isCompleted ? 'card-glow-emerald' : ''}`}
                            >
                              {isCompleted ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                              ) : (
                                <span className={activeCourse === section.id ? 'text-primary-foreground' : ''}>{section.icon}</span>
                              )}
                              <span className="font-medium flex-1">{section.title}</span>
                              {chapterNotes[section.id] && (
                                <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                              )}
                              <button
                                onClick={(e) => toggleSectionCompletion(section.id, e)}
                                className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                                  isCompleted
                                    ? 'bg-emerald-500 border-emerald-500'
                                    : 'border-muted-foreground/40 hover:border-primary/50'
                                }`}
                                aria-label={isCompleted ? 'Marquer comme non complété' : 'Marquer comme complété'}
                              >
                                {isCompleted && <Check className="w-2.5 h-2.5 text-white" />}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </ScrollArea>
                    {/* Progress Bar */}
                    <div className="mt-4 pt-4 border-t border-border">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-muted-foreground">
                          {completedSections.length}/{courseSections.length} chapitres complétés
                        </span>
                        <span className="text-xs font-medium text-emerald-400">
                          {Math.round((completedSections.length / courseSections.length) * 100)}%
                        </span>
                      </div>
                      <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
                          initial={false}
                          animate={{
                            width: `${(completedSections.length / courseSections.length) * 100}%`,
                          }}
                          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        />
                      </div>
                    </div>
                    {/* Quiz Stats */}
                    <div className="mt-3 pt-3 border-t border-border">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Brain className="w-3 h-3" />
                          {completedQuizzes}/{totalQuizzes} quizs complétés
                        </span>
                        <span className="text-xs font-medium text-primary-foreground">
                          {Math.round((completedQuizzes / totalQuizzes) * 100)}%
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-primary to-purple-500 rounded-full"
                          initial={false}
                          animate={{
                            width: `${(completedQuizzes / totalQuizzes) * 100}%`,
                          }}
                          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        />
                      </div>
                    </div>
                    {/* Achievements Button */}
                    <div className="mt-3 pt-3 border-t border-border">
                      <button
                        onClick={() => setShowAchievements(prev => !prev)}
                        className="w-full flex items-center justify-between px-2 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all"
                      >
                        <span className="flex items-center gap-2">
                          <Award className="w-3.5 h-3.5 text-amber-400" />
                          Succès
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">{unlockedAchievements.length}/{achievementDefs.length}</span>
                          <motion.div animate={{ rotate: showAchievements ? 180 : 0 }} transition={{ duration: 0.2 }}>
                            <ChevronDown className="w-3.5 h-3.5" />
                          </motion.div>
                        </div>
                      </button>
                      <AnimatePresence>
                        {showAchievements && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="overflow-hidden"
                          >
                            <div className="pt-2 grid grid-cols-2 gap-2 max-h-[280px] overflow-y-auto">
                              {achievementDefs.map((ach) => {
                                const isUnlocked = unlockedAchievements.includes(ach.id);
                                return (
                                  <div
                                    key={ach.id}
                                    className={`flex flex-col items-center gap-1 p-2 rounded-lg text-center transition-all ${
                                      isUnlocked
                                        ? `bg-secondary/50 ${ach.glowColor} shadow-md`
                                        : 'bg-secondary/20 opacity-40'
                                    }`}
                                    title={ach.description}
                                  >
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                      isUnlocked ? ach.color : 'text-muted-foreground'
                                    }`}>
                                      {isUnlocked ? ach.icon : <Lock className="w-5 h-5" />}
                                    </div>
                                    <span className="text-[10px] font-medium leading-tight">{ach.name}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    {/* Export Progress Button */}
                    <div className="mt-3 pt-3 border-t border-border">
                      <button
                        onClick={exportAllProgress}
                        className="w-full flex items-center gap-2 px-2 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all"
                      >
                        <Download className="w-3.5 h-3.5 text-primary-foreground" />
                        <span>Exporter Ma Progression</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 min-w-0">
                  <AnimatePresence mode="wait">
                    {courseSections
                      .filter((s) => s.id === activeCourse)
                      .map((section) => (
                        <motion.div
                          key={section.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.25 }}
                          className="glass-card rounded-xl p-6 sm:p-8"
                        >
                          <div className="flex items-center justify-between mb-6">
                            <div className="badge-soft flex items-center gap-2 text-sm text-muted-foreground">
                              <Clock className="w-4 h-4" />
                              <span><Clock className="w-3 h-3 inline mr-1" />{section.readingTime} min de lecture</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {quizData[section.id] && (
                                <Button
                                  variant={showQuiz === section.id ? 'default' : 'outline'}
                                  size="sm"
                                  onClick={() => {
                                    setShowQuiz(showQuiz === section.id ? null : section.id);
                                    if (showQuiz !== section.id) {
                                      setQuizAnswers(prev => ({ ...prev, [section.id]: {} }));
                                      setQuizVerified(prev => ({ ...prev, [section.id]: false }));
                                    }
                                  }}
                                  className={showQuiz === section.id ? 'bg-gradient-to-r from-primary to-purple-500 text-white' : 'border-border hover:bg-secondary'}
                                >
                                  <Brain className="w-4 h-4 mr-2" />
                                  Quiz
                                </Button>
                              )}
                              <Button
                                variant={showNotes === section.id ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setShowNotes(showNotes === section.id ? null : section.id)}
                                className={showNotes === section.id ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white' : 'border-border hover:bg-secondary'}
                              >
                                <StickyNote className="w-4 h-4 mr-2" />
                                Notes
                                {chapterNotes[section.id] && (
                                  <span className="ml-1.5 w-2 h-2 rounded-full bg-amber-400 inline-block" />
                                )}
                              </Button>
                              <Button
                                variant={showCheatSheet === section.id ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setShowCheatSheet(showCheatSheet === section.id ? null : section.id)}
                                className={showCheatSheet === section.id ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white' : 'border-border hover:bg-secondary'}
                              >
                                <BookMarked className="w-4 h-4 mr-2" />
                                Cheat Sheet
                              </Button>
                            </div>
                          </div>
                          {section.content}
                          {showQuiz === section.id && quizData[section.id] && (
                            <div className="mt-8 border-t border-border pt-6 card-hover-glow indigo rounded-xl p-4 -mx-4">
                              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <Brain className="w-5 h-5 text-primary-foreground" />
                                Quiz — {section.title}
                                {quizDifficultyMap[section.id] && (
                                  <Badge className={`glass-badge-3d ${quizDifficultyMap[section.id].color} border text-xs ml-2`} variant="outline">
                                    {quizDifficultyMap[section.id].label}
                                  </Badge>
                                )}
                                {/* Quiz Timer Display */}
                                {!quizVerified[section.id] && quizTimer[section.id] !== undefined && (
                                  <Badge
                                    className={`text-xs ml-2 font-mono tabular-nums border ${
                                      quizTimer[section.id] <= 5
                                        ? 'bg-red-500/10 text-red-400 border-red-500/20'
                                        : quizTimer[section.id] <= 10
                                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                          : 'bg-secondary/50 text-muted-foreground border-border'
                                    }`}
                                    variant="outline"
                                  >
                                    <Timer className="w-3 h-3 inline mr-1" />{quizTimer[section.id]}s
                                  </Badge>
                                )}
                              </h3>
                              <div className="space-y-6">
                                {(quizShuffle[section.id] ? quizShuffle[section.id].map(i => ({ q: quizData[section.id][i], originalIdx: i })) : quizData[section.id].map((q, i) => ({ q, originalIdx: i }))).map(({ q, originalIdx }, displayIdx) => {
                                  const qi = originalIdx;
                                  const currentAnswers = quizAnswers[section.id] || {};
                                  return (
                                    <div key={qi} className="space-y-3">
                                      <p className="font-medium text-sm">{displayIdx + 1}. {q.question}</p>
                                      <div className="grid gap-2">
                                        {q.options.map((option, oi) => {
                                          const isSelected = currentAnswers[qi] === String(oi);
                                          const isVerified = quizVerified[section.id];
                                          const isCorrect = oi === q.correctIndex;

                                          let optionClass = 'border-border hover:border-primary/30 hover:bg-primary/5 cursor-pointer';
                                          if (isSelected && !isVerified) {
                                            optionClass = 'border-primary/50 bg-primary/10';
                                          }
                                          if (isVerified && isCorrect) {
                                            optionClass = 'border-emerald-500 bg-emerald-500/10 text-emerald-400';
                                          }
                                          if (isVerified && isSelected && !isCorrect) {
                                            optionClass = 'border-red-500 bg-red-500/10 text-red-400';
                                          }

                                          return (
                                            <div
                                              key={oi}
                                              role="radio"
                                              aria-checked={isSelected}
                                              tabIndex={0}
                                              className={`flex items-center gap-3 rounded-lg border p-3 text-sm transition-colors ${optionClass}`}
                                              onClick={() => {
                                                if (!quizVerified[section.id]) {
                                                  setQuizAnswers(prev => ({
                                                    ...prev,
                                                    [section.id]: { ...prev[section.id], [qi]: String(oi) },
                                                  }));
                                                }
                                              }}
                                              onKeyDown={(e) => {
                                                if ((e.key === 'Enter' || e.key === ' ') && !quizVerified[section.id]) {
                                                  e.preventDefault();
                                                  setQuizAnswers(prev => ({
                                                    ...prev,
                                                    [section.id]: { ...prev[section.id], [qi]: String(oi) },
                                                  }));
                                                }
                                              }}
                                            >
                                              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                                                isSelected ? 'border-primary bg-primary' : 'border-muted-foreground/40'
                                              } ${isVerified && isCorrect ? '!border-emerald-500 !bg-emerald-500' : ''} ${
                                                isVerified && isSelected && !isCorrect ? '!border-red-500 !bg-red-500' : ''
                                              }`}>
                                                {isSelected && (
                                                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                                                )}
                                              </div>
                                              <span className="flex-1">{option}</span>
                                              {isVerified && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400 ml-auto shrink-0" />}
                                              {isVerified && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-red-400 ml-auto shrink-0" />}
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>

                              <div className="mt-6 flex items-center gap-4">
                                {!quizVerified[section.id] ? (
                                  <Button
                                    onClick={() => {
                                      setQuizVerified(prev => ({ ...prev, [section.id]: true }));
                                      const answers = quizAnswers[section.id] || {};
                                      const questions = quizData[section.id];
                                      let score = 0;
                                      questions.forEach((q, qIdx) => {
                                        if (answers[qIdx] === String(q.correctIndex)) {
                                          score++;
                                        }
                                      });
                                      setQuizScores(prev => ({ ...prev, [section.id]: score }));
                                      addActivity('Quiz terminé', `${section.title} — ${score}/${questions.length}`, 'Brain');
                                      // Feature 1: Confetti on perfect score
                                      if (score === questions.length) {
                                        toast.success('Parfait ! Score parfait !');
                                        setTimeout(() => triggerConfetti(), 300);
                                      }
                                      // Feature 2: Mark as studied
                                      markAsStudied();
                                      // Feature 4: Check achievements
                                      setTimeout(() => checkAchievements({
                                        completedSections: completedSections,
                                        quizVerified: { ...quizVerified, [section.id]: true },
                                        quizScores: { ...quizScores, [section.id]: score },
                                        chapterNotes,
                                        bookmarkedTps,
                                      }), 500);
                                    }}
                                    className="bg-gradient-to-r from-primary to-purple-500 text-white hover-lift-sm"
                                    disabled={Object.keys(quizAnswers[section.id] || {}).length < quizData[section.id].length}
                                  >
                                    <Check className="w-4 h-4 mr-2" />
                                    Vérifier les réponses
                                  </Button>
                                ) : (
                                  <div className="flex items-center gap-3">
                                    <Badge
                                      variant="outline"
                                      className={
                                        quizScores[section.id] === quizData[section.id].length
                                          ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10'
                                          : quizScores[section.id] > 0
                                            ? 'border-amber-500/30 text-amber-400 bg-amber-500/10'
                                            : 'border-red-500/30 text-red-400 bg-red-500/10'
                                      }
                                    >
                                      {quizScores[section.id]}/{quizData[section.id].length} correct
                                    </Badge>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="hover-lift-sm"
                                      onClick={() => {
                                        setQuizAnswers(prev => ({ ...prev, [section.id]: {} }));
                                        setQuizVerified(prev => ({ ...prev, [section.id]: false }));
                                        setQuizScores(prev => ({ ...prev, [section.id]: 0 }));
                                      }}
                                    >
                                      Recommencer
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => {
                                        const indices = quizData[section.id].map((_, i) => i);
                                        for (let i = indices.length - 1; i > 0; i--) {
                                          const j = Math.floor(Math.random() * (i + 1));
                                          [indices[i], indices[j]] = [indices[j], indices[i]];
                                        }
                                        setQuizShuffle(prev => ({ ...prev, [section.id]: indices }));
                                        setQuizAnswers(prev => ({ ...prev, [section.id]: {} }));
                                        setQuizVerified(prev => ({ ...prev, [section.id]: false }));
                                      }}
                                    >
                                      <Shuffle className="w-3 h-3 mr-1" />
                                      Mélanger
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                          {showNotes === section.id && (
                            <div className="mt-6 border-t border-border pt-4">
                              <div className="flex items-center gap-2 mb-3">
                                <StickyNote className="w-4 h-4 text-amber-400" />
                                <h3 className="text-sm font-semibold">Notes personnelles</h3>
                              </div>
                              <Textarea
                                value={chapterNotes[section.id] || ''}
                                onChange={(e) => {
                                  setChapterNotes(prev => ({ ...prev, [section.id]: e.target.value }));
                                  if (e.target.value.trim().length > 0) {
                                    markAsStudied();
                                    setTimeout(() => checkAchievements({ completedSections, quizVerified, quizScores, chapterNotes: { ...chapterNotes, [section.id]: e.target.value }, bookmarkedTps }), 500);
                                  }
                                  // Debounced activity log for notes save
                                  if (notesActivityDebounceRef.current) clearTimeout(notesActivityDebounceRef.current);
                                  notesActivityDebounceRef.current = setTimeout(() => {
                                    addActivity('Notes sauvegardées', section.title, 'StickyNote');
                                  }, 2000);
                                }}
                                placeholder="Prenez des notes sur ce chapitre..."
                                rows={4}
                                className="bg-secondary/30 border-border resize-y text-sm"
                              />
                              <p className="text-xs text-muted-foreground mt-1.5">
                                {chapterNotes[section.id] ? `${chapterNotes[section.id].length} caractères` : 'Vos notes sont sauvegardées automatiquement'}
                              </p>
                            </div>
                          )}
                          {showCheatSheet === section.id && cheatsheetData[section.id] && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-6 border-t border-border pt-4"
                            >
                              <div className="rounded-xl p-4 sm:p-5 bg-gradient-to-br from-emerald-500/5 via-secondary/30 to-teal-500/5 border border-emerald-500/10">
                                <div className="flex items-center gap-2 mb-4">
                                  <BookMarked className="w-4 h-4 text-emerald-400" />
                                  <h3 className="text-sm font-semibold text-emerald-400">Cheat Sheet — {section.title}</h3>
                                </div>
                                <div className="grid sm:grid-cols-2 gap-4">
                                  {/* Formulas */}
                                  <div className="space-y-2">
                                    <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                                      <FileCode2 className="w-3 h-3" /> Formules clés
                                    </h4>
                                    <div className="space-y-1.5">
                                      {cheatsheetData[section.id].formulas.map((formula, i) => (
                                        <div key={i} className="font-mono text-xs bg-secondary/50 rounded px-3 py-2 border border-border text-primary-foreground/80">
                                          {formula}
                                        </div>
                                      ))}
                                    </div>
                                  </div>

                                  {/* Methods */}
                                  <div className="space-y-2">
                                    <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                                      <Code2 className="w-3 h-3" /> Fonctions & Méthodes
                                    </h4>
                                    <div className="space-y-1.5">
                                      {cheatsheetData[section.id].methods.map((method, i) => (
                                        <div key={i} className="font-mono text-xs bg-secondary/50 rounded px-3 py-2 border border-border text-emerald-400/90 break-all">
                                          {method}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>

                                {/* Pitfalls */}
                                <div className="mt-4 space-y-1.5">
                                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                                    <AlertTriangle className="w-3 h-3" /> Pièges courants
                                  </h4>
                                  {cheatsheetData[section.id].pitfalls.map((pitfall, i) => (
                                    <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground bg-red-500/5 rounded px-3 py-2 border border-red-500/10">
                                      <XCircle className="w-3 h-3 text-red-400 mt-0.5 shrink-0" />
                                      <span>{pitfall}</span>
                                    </div>
                                  ))}
                                </div>

                                {/* Tip Callout */}
                                <div className="mt-4 bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
                                  <div className="flex items-start gap-2">
                                    <Lightbulb className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                                    <div>
                                      <span className="text-xs font-semibold text-amber-400">Astuce : </span>
                                      <span className="text-xs text-muted-foreground">{cheatsheetData[section.id].tip}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </motion.div>
                      ))}
                  </AnimatePresence>

                  {/* Prev/Next Navigation */}
                  <div className="flex items-center justify-between mt-6 gap-4">
                    <Button
                      variant="outline"
                      disabled={!prevChapter}
                      onClick={() => prevChapter && handleChapterChange(prevChapter.id)}
                      className="border-border hover:bg-secondary"
                    >
                      <ChevronLeft className="w-4 h-4 mr-2" />
                      {prevChapter ? `← ${prevChapter.title}` : 'Chapitre Précédent'}
                    </Button>
                    <Button
                      variant="outline"
                      disabled={!nextChapter}
                      onClick={() => nextChapter && handleChapterChange(nextChapter.id)}
                      className="border-border hover:bg-secondary"
                    >
                      {nextChapter ? `${nextChapter.title} →` : 'Chapitre Suivant'}
                    </Button>
                  </div>

                  {/* Public Notebooks Section */}
                  <div className="mt-12 glass-card rounded-xl p-6 sm:p-8">
                    <h2 className="text-xl sm:text-2xl font-bold mb-3 flex items-center gap-3">
                      <FileCode2 className="w-6 h-6 text-emerald-400" />
                      <span className="gradient-text">Notebooks</span> disponibles
                    </h2>
                    <p className="text-muted-foreground mb-6 text-sm">
                      Téléchargez les notebooks Jupyter fournis par l&apos;instructeur pour pratiquer.
                    </p>
                    {notebooksLoading ? (
                      <div className="grid sm:grid-cols-2 gap-4">
                        {[1, 2].map((i) => (
                          <div key={i} className="h-24 rounded-lg bg-secondary/30 animate-pulse" />
                        ))}
                      </div>
                    ) : publicNotebooks.length === 0 ? (
                      <div className="text-center py-10 text-muted-foreground">
                        <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
                        <p className="text-sm">Aucun notebook disponible pour le moment.</p>
                        <p className="text-xs mt-1">Les notebooks seront ajoutés par l&apos;instructeur.</p>
                      </div>
                    ) : (
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {publicNotebooks.map((nb) => {
                          const chapterInfo = courseSections.find(s => s.id === nb.chapter);
                          const sizeStr = nb.fileSize > 1024 * 1024
                            ? `${(nb.fileSize / (1024 * 1024)).toFixed(1)} Mo`
                            : nb.fileSize > 1024
                              ? `${(nb.fileSize / 1024).toFixed(1)} Ko`
                              : `${nb.fileSize} o`;
                          return (
                            <motion.div
                              key={nb.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="group relative rounded-lg border border-border bg-secondary/20 hover:bg-secondary/40 hover:border-primary/30 transition-all duration-200 p-4"
                            >
                              <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0 group-hover:bg-emerald-500/20 transition-colors">
                                  <FileCode2 className="w-5 h-5 text-emerald-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium truncate group-hover:text-primary-foreground transition-colors">{nb.title}</p>
                                  {nb.description && (
                                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{nb.description}</p>
                                  )}
                                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                                    <span className="text-[10px] text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded-full">{nb.fileName}</span>
                                    <span className="text-[10px] text-muted-foreground">{sizeStr}</span>
                                    {chapterInfo && (
                                      <span className="text-[10px] text-primary-foreground/70 bg-primary/10 px-2 py-0.5 rounded-full">{chapterInfo.title}</span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <a
                                href={`/api/notebooks/download?id=${nb.id}`}
                                download
                                className="mt-3 flex items-center justify-center gap-1.5 w-full py-2 rounded-md text-xs font-medium bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                              >
                                <Download className="w-3.5 h-3.5" />
                                Télécharger
                              </a>
                            </motion.div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Glossary Section */}
                  <div className="mt-12 glass-card rounded-xl p-6 sm:p-8">
                    <h2 className="text-xl sm:text-2xl font-bold mb-6 flex items-center gap-3">
                      <BookMarked className="w-6 h-6 text-primary-foreground" />
                      <span className="gradient-text">Glossaire</span> du Machine Learning
                    </h2>
                    <p className="text-muted-foreground mb-6 text-sm">
                      Référence rapide des termes essentiels en Machine Learning et Deep Learning.
                    </p>
                    <div className="relative mb-6">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        value={glossarySearch}
                        onChange={(e) => setGlossarySearch(e.target.value)}
                        placeholder="Rechercher un terme..."
                        className="pl-10 pr-9 bg-secondary/30 border-border"
                      />
                      {glossarySearch && (
                        <button
                          onClick={() => setGlossarySearch('')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          aria-label="Effacer la recherche"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <Accordion type="multiple" className="w-full" key={`glossary-${activeTab}`}>
                      {glossaryCategories.map((cat) => {
                        const filteredTerms = glossaryData
                          .filter(entry => entry.category === cat)
                          .filter(entry => {
                            if (!glossarySearch) return true;
                            const lower = glossarySearch.toLowerCase();
                            return entry.term.toLowerCase().includes(lower) || entry.definition.toLowerCase().includes(lower);
                          });
                        if (filteredTerms.length === 0) return null;
                        return (
                          <AccordionItem key={cat} value={cat}>
                            <AccordionTrigger className="text-sm font-semibold hover:no-underline">
                              <span className="flex items-center gap-2">
                                {cat}
                                <Badge variant="secondary" className="text-[10px] font-normal">{filteredTerms.length}</Badge>
                              </span>
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="space-y-3 pt-2">
                                {filteredTerms.map((entry) => (
                                  <div key={entry.term} className="bg-secondary/20 rounded-lg p-3">
                                    <h4 className="text-sm font-semibold text-primary-foreground mb-1">{entry.term}</h4>
                                    <p className="text-xs text-muted-foreground leading-relaxed">{entry.definition}</p>
                                  </div>
                                ))}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        );
                      })}
                    </Accordion>
                    {glossarySearch && glossaryData.filter(entry => {
                      const lower = glossarySearch.toLowerCase();
                      return entry.term.toLowerCase().includes(lower) || entry.definition.toLowerCase().includes(lower);
                    }).length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Aucun terme trouvé pour « {glossarySearch} »</p>
                      </div>
                    )}
                  </div>

                  {/* ML Formulas Cheatsheet Section */}
                  <div className="mt-12 glass-card rounded-xl p-6 sm:p-8">
                    <h2 className="text-xl sm:text-2xl font-bold mb-3 flex items-center gap-3">
                      <Sparkles className="w-6 h-6 text-primary-foreground" />
                      <span className="gradient-text">Formules Essentielles</span>
                    </h2>
                    <p className="text-muted-foreground mb-6 text-sm">
                      Référence rapide des formules fondamentales en Machine Learning et Deep Learning.
                    </p>
                    {/* Search */}
                    <div className="relative mb-4">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        value={formulaSearch}
                        onChange={(e) => setFormulaSearch(e.target.value)}
                        placeholder="Rechercher une formule..."
                        className="pl-10 pr-9 bg-secondary/30 border-border"
                      />
                      {formulaSearch && (
                        <button
                          onClick={() => setFormulaSearch('')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          aria-label="Effacer la recherche"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    {/* Category filter pills */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      <Button
                        size="sm"
                        variant={formulaCategoryFilter === 'Tous' ? 'default' : 'outline'}
                        onClick={() => setFormulaCategoryFilter('Tous')}
                        className={formulaCategoryFilter === 'Tous'
                          ? 'bg-gradient-to-r from-primary to-purple-500 text-white border-0'
                          : 'border-border hover:bg-secondary text-muted-foreground'
                        }
                      >
                        Tous
                      </Button>
                      {formulaCategories.map((cat) => {
                        const colors = formulaCategoryColors[cat];
                        const isActive = formulaCategoryFilter === cat;
                        return (
                          <Button
                            key={cat}
                            size="sm"
                            variant={isActive ? 'default' : 'outline'}
                            onClick={() => setFormulaCategoryFilter(isActive ? 'Tous' : cat)}
                            className={isActive
                              ? `${colors} border font-medium`
                              : 'border-border hover:bg-secondary text-muted-foreground'
                            }
                          >
                            {cat}
                          </Button>
                        );
                      })}
                    </div>
                    {/* Formula cards grid */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <AnimatePresence mode="popLayout">
                        {formulaCardsData
                          .filter((f) => {
                            if (formulaCategoryFilter !== 'Tous' && f.category !== formulaCategoryFilter) return false;
                            if (formulaSearch) {
                              const q = formulaSearch.toLowerCase();
                              return f.title.toLowerCase().includes(q) || f.category.toLowerCase().includes(q) || f.description.toLowerCase().includes(q);
                            }
                            return true;
                          })
                          .map((formula, index) => (
                            <motion.div
                              key={formula.title}
                              layout
                              initial={{ opacity: 0, y: 15, scale: 0.97 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
                              transition={{ duration: 0.25, delay: index * 0.04 }}
                              className="group relative rounded-lg border border-border bg-secondary/20 hover:bg-secondary/40 hover:border-primary/30 transition-all duration-200 p-4"
                            >
                              <div className="flex items-start justify-between gap-2 mb-3">
                                <div className="flex items-center gap-2">
                                  <FormulaIcon name={formula.emoji} />
                                  <h3 className="text-sm font-semibold text-foreground">{formula.title}</h3>
                                </div>
                                <Badge variant="outline" className={`text-[10px] shrink-0 glass-tag border ${formulaCategoryColors[formula.category]}`}>
                                  {formula.category}
                                </Badge>
                              </div>
                              <div className="bg-black/30 rounded-md px-3 py-2 mb-3 formula-display">
                                <code className="text-sm font-mono gradient-text break-all leading-relaxed">{formula.formula}</code>
                              </div>
                              <p className="text-xs text-muted-foreground leading-relaxed">{formula.description}</p>
                            </motion.div>
                          ))}
                      </AnimatePresence>
                    </div>
                    {formulaCardsData.filter((f) => {
                      if (formulaCategoryFilter !== 'Tous' && f.category !== formulaCategoryFilter) return false;
                      if (formulaSearch) {
                        const q = formulaSearch.toLowerCase();
                        return f.title.toLowerCase().includes(q) || f.category.toLowerCase().includes(q) || f.description.toLowerCase().includes(q);
                      }
                      return true;
                    }).length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Aucune formule trouvée pour « {formulaSearch} »</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Dynamic Course Chapters Section */}
              {publicChapters.length > 0 && (
                <div className="mt-10">
                  <h2 className="text-xl sm:text-2xl font-bold mb-3 flex items-center gap-3">
                    <Layers className="w-6 h-6 text-emerald-400" />
                    <span className="gradient-text">Chapitre Supplémentaires</span>
                  </h2>
                  <p className="text-muted-foreground mb-6 text-sm">
                    Chapitres et notebooks additionnels pour approfondir votre apprentissage.
                  </p>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {publicChapters.map((chapter) => (
                      <Card key={chapter.id} className="glass-card hover:shadow-lg transition-all duration-300 group">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between gap-2">
                            <CardTitle className="text-sm font-semibold leading-tight group-hover:text-primary transition-colors">
                              {chapter.title}
                            </CardTitle>
                            <Badge variant="outline" className="text-[10px] shrink-0 glass-tag">
                              {chapter.type}
                            </Badge>
                          </div>
                          {chapter.description && (
                            <CardDescription className="text-xs line-clamp-2 mt-1">
                              {chapter.description}
                            </CardDescription>
                          )}
                        </CardHeader>
                        {(chapter.notebooks && chapter.notebooks.length > 0) && (
                          <CardContent className="pt-0">
                            <div className="space-y-2">
                              <h5 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                                <FileCode2 className="w-3 h-3" /> Notebooks ({chapter.notebooks.length})
                              </h5>
                              {chapter.notebooks.map((nb) => (
                                <div key={nb.id} className="flex items-center gap-2 p-2 rounded-lg bg-secondary/50 hover:bg-secondary/80 transition-colors text-xs">
                                  <FileText className="w-3 h-3 text-amber-400 shrink-0" />
                                  <span className="flex-1 truncate font-medium">{nb.title || nb.fileName}</span>
                                  <span className="text-muted-foreground shrink-0">{(nb.fileSize / 1024).toFixed(1)} Ko</span>
                                  {nb.colabUrl && (
                                    <a
                                      href={nb.colabUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors text-[10px] font-medium shrink-0"
                                      title="Ouvrir dans Google Colab"
                                    >
                                      <ExternalLink className="w-2.5 h-2.5" />
                                      Colab
                                    </a>
                                  )}
                                  <a
                                    href={`/api/chapter-notebooks/download?id=${nb.id}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center p-1 rounded bg-secondary text-muted-foreground hover:text-foreground transition-colors shrink-0"
                                    title="Télécharger"
                                  >
                                    <Download className="w-2.5 h-2.5" />
                                  </a>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        )}
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* ═══════ TPs TAB ═══════ */}
          {activeTab === 'tps' && (
            <motion.div
              key="tps"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold mb-3">
                    <span className="gradient-text">Travaux</span> Pratiques
                  </h1>
                  <p className="text-muted-foreground">
                    Pratiquez sur des datasets réels avec des projets concrets.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  {isAdminAuthenticated && (
                  <>
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="border-border hover:bg-secondary"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Importer JSON
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json"
                    className="hidden"
                    onChange={importTps}
                  />
                  <Button variant="outline" onClick={seedDatabase} className="border-border hover:bg-secondary">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Recharger TPs
                  </Button>
                  </>)}
                  {isAdminAuthenticated && (
                  <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-gradient-to-r from-primary to-purple-500 text-white hover:from-primary/90 hover:to-purple-500/90">
                        <Plus className="w-4 h-4 mr-2" />
                        {editingTpId ? 'Modifier le TP' : 'Ajouter un TP'}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card border-border">
                      <DialogHeader>
                        <DialogTitle>{editingTpId ? 'Modifier le TP' : 'Ajouter un nouveau TP'}</DialogTitle>
                        <DialogDescription>Remplissez les informations du travail pratique.</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 mt-4">
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Titre *</Label>
                            <Input
                              value={newTp.title}
                              onChange={(e) => setNewTp({ ...newTp, title: e.target.value })}
                              placeholder="TP 5 : ..."
                              className="glass-input"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Catégorie</Label>
                            <Select value={newTp.category} onValueChange={(v) => setNewTp({ ...newTp, category: v })}>
                              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                              <SelectContent>
                                {['Classification', 'Régression', 'Séries Temporelles', 'Clustering', 'NLP', 'Vision'].map((c) => (
                                  <SelectItem key={c} value={c}>{c}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Description *</Label>
                          <Textarea
                            value={newTp.description}
                            onChange={(e) => setNewTp({ ...newTp, description: e.target.value })}
                            placeholder="Description du TP..."
                            rows={3}
                          />
                        </div>
                        <div className="grid sm:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label>Difficulté</Label>
                            <Select value={newTp.difficulty} onValueChange={(v) => setNewTp({ ...newTp, difficulty: v })}>
                              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                              <SelectContent>
                                {['Débutant', 'Intermédiaire', 'Avancé'].map((d) => (
                                  <SelectItem key={d} value={d}>{d}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Durée</Label>
                            <Input
                              value={newTp.duration}
                              onChange={(e) => setNewTp({ ...newTp, duration: e.target.value })}
                              placeholder="60 min"
                              className="glass-input"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Couleur</Label>
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                value={newTp.color}
                                onChange={(e) => setNewTp({ ...newTp, color: e.target.value })}
                                className="w-10 h-10 rounded-lg cursor-pointer border-0 bg-transparent"
                              />
                              <Input
                                value={newTp.color}
                                onChange={(e) => setNewTp({ ...newTp, color: e.target.value })}
                                className="flex-1 glass-input"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Colab URL</Label>
                            <Input
                              value={newTp.colabUrl}
                              onChange={(e) => setNewTp({ ...newTp, colabUrl: e.target.value })}
                              placeholder="https://colab.research.google.com/..."
                              className="glass-input"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Kaggle URL</Label>
                            <Input
                              value={newTp.kaggleUrl}
                              onChange={(e) => setNewTp({ ...newTp, kaggleUrl: e.target.value })}
                              placeholder="https://www.kaggle.com/..."
                              className="glass-input"
                            />
                          </div>
                        </div>
                        <Separator />
                        <h4 className="font-semibold text-sm text-muted-foreground">Dataset</h4>
                        <div className="grid sm:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label>Nom</Label>
                            <Input value={newTp.datasetName} onChange={(e) => setNewTp({ ...newTp, datasetName: e.target.value })} placeholder="Nom du dataset" className="glass-input" />
                          </div>
                          <div className="space-y-2">
                            <Label>Lignes</Label>
                            <Input value={newTp.datasetRows} onChange={(e) => setNewTp({ ...newTp, datasetRows: e.target.value })} placeholder="1000" className="glass-input" />
                          </div>
                          <div className="space-y-2">
                            <Label>Colonnes</Label>
                            <Input value={newTp.datasetCols} onChange={(e) => setNewTp({ ...newTp, datasetCols: e.target.value })} placeholder="20" className="glass-input" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Objectif</Label>
                          <Textarea value={newTp.objective} onChange={(e) => setNewTp({ ...newTp, objective: e.target.value })} placeholder="Objectif du TP..." rows={2} className="glass-input" />
                        </div>
                        <div className="space-y-2">
                          <Label>Résultat attendu</Label>
                          <Textarea value={newTp.expectedResult} onChange={(e) => setNewTp({ ...newTp, expectedResult: e.target.value })} placeholder="Résultat attendu..." rows={2} className="glass-input" />
                        </div>
                        <Separator />
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label>Étapes</Label>
                            <Button type="button" variant="ghost" size="sm" onClick={() => setNewTp({ ...newTp, steps: [...newTp.steps, ''] })}>
                              <Plus className="w-3 h-3 mr-1" /> Ajouter
                            </Button>
                          </div>
                          {newTp.steps.map((step, i) => (
                            <div key={i} className="flex gap-2">
                              <Input value={step} onChange={(e) => { const s = [...newTp.steps]; s[i] = e.target.value; setNewTp({ ...newTp, steps: s }); }} placeholder={`Étape ${i + 1}`} className="glass-input" />
                              <Button type="button" variant="ghost" size="icon" onClick={() => setNewTp({ ...newTp, steps: newTp.steps.filter((_, j) => j !== i) })}>
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </Button>
                            </div>
                          ))}
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label>Concepts</Label>
                            <Button type="button" variant="ghost" size="sm" onClick={() => setNewTp({ ...newTp, concepts: [...newTp.concepts, ''] })}>
                              <Plus className="w-3 h-3 mr-1" /> Ajouter
                            </Button>
                          </div>
                          {newTp.concepts.map((concept, i) => (
                            <div key={i} className="flex gap-2">
                              <Input value={concept} onChange={(e) => { const c = [...newTp.concepts]; c[i] = e.target.value; setNewTp({ ...newTp, concepts: c }); }} placeholder={`Concept ${i + 1}`} className="glass-input" />
                              <Button type="button" variant="ghost" size="icon" onClick={() => setNewTp({ ...newTp, concepts: newTp.concepts.filter((_, j) => j !== i) })}>
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </Button>
                            </div>
                          ))}
                        </div>
                        <div className="space-y-2">
                          <Label>Tags (séparés par des virgules)</Label>
                          <Input value={newTp.tags} onChange={(e) => setNewTp({ ...newTp, tags: e.target.value })} placeholder="ml, python, keras" />
                        </div>
                      </div>
                      {isAdminAuthenticated && (
                      <div className="space-y-2">
                        <Label>Notebook (.ipynb, .py, .json)</Label>
                        <div className="flex items-center gap-2">
                          <Input type="file" accept=".ipynb,.py,.json" onChange={(e) => setTpNotebookUpload(e.target.files?.[0] || null)} className="glass-input" />
                        </div>
                        {tpNotebookUpload && (
                          <p className="text-xs text-muted-foreground"><FileText className="w-3 h-3 inline mr-1" />{tpNotebookUpload.name} ({(tpNotebookUpload.size / 1024).toFixed(1)} Ko)</p>
                        )}
                      </div>
                      )}
                      <DialogFooter className="mt-6">
                        <Button variant="outline" onClick={() => setAddDialogOpen(false)}>Annuler</Button>
                        <Button onClick={editingTpId ? updateTp : addTp} className="bg-gradient-to-r from-primary to-purple-500 text-white">
                          {editingTpId ? 'Enregistrer' : 'Créer le TP'}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  )}
                </div>
              </div>

              {/* ── TP Learning Path ── */}
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary-foreground" />
                  <span className="gradient-text">Parcours d&apos;Apprentissage</span>
                </h2>
                <div className="flex flex-col md:flex-row items-stretch gap-3 md:gap-0">
                  {[
                    { num: 1, title: 'Titanic', difficulty: 'Débutant', color: '#6366f1', gradient: 'from-blue-500 to-indigo-500' },
                    { num: 2, title: 'House Prices', difficulty: 'Intermédiaire', color: '#10b981', gradient: 'from-emerald-500 to-teal-500' },
                    { num: 3, title: 'Iris', difficulty: 'Intermédiaire', color: '#8b5cf6', gradient: 'from-purple-500 to-violet-500' },
                    { num: 4, title: 'LSTM Énergie', difficulty: 'Avancé', color: '#ef4444', gradient: 'from-red-500 to-rose-500' },
                  ].map((tp, i) => {
                    return (
                      <div key={tp.num} className="flex items-center gap-3 md:gap-0 flex-1">
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.15 }}
                          className={`relative flex-shrink-0 w-full md:w-48 glass-card rounded-xl p-4 transition-all duration-300 cursor-pointer hover:shadow-lg ${
                            i === 0 ? 'ring-2 ring-primary/40 shadow-lg shadow-primary/10' : 'hover:shadow-md'
                          }`}
                          style={{ borderLeft: `3px solid ${tp.color}` }}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${tp.gradient} flex items-center justify-center text-xs font-bold text-white`}>
                              {tp.num}
                            </div>
                            <span className="text-sm font-semibold flex-1">{tp.title}</span>
                          </div>
                          <Badge
                            className={`text-[10px] border ${
                              tp.difficulty === 'Débutant' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                : tp.difficulty === 'Avancé' ? 'bg-red-500/10 text-red-400 border-red-500/20'
                                  : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                            }`}
                            variant="outline"
                          >
                            {tp.difficulty}
                          </Badge>
                        </motion.div>
                        {i < 3 && (
                          <div className="hidden md:flex items-center flex-shrink-0 px-1">
                            <div className="w-8 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
                            <ChevronRight className="w-4 h-4 text-muted-foreground/50 -ml-1" />
                          </div>
                        )}
                        {i < 3 && (
                          <div className="flex md:hidden items-center justify-center py-1">
                            <ChevronDown className="w-4 h-4 text-muted-foreground/50" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ── Algorithm Comparison Table (Enhanced) ── */}
              <Card className="mb-8 glass-card overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <BarChart3 className="w-5 h-5 text-primary-foreground" />
                    <div>
                      <CardTitle className="text-lg gradient-text">Comparaison des Algorithmes ML</CardTitle>
                      <CardDescription className="text-xs mt-1">Les 6 algorithmes principaux couverts dans cette formation</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="px-0 pb-4">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm min-w-[700px]">
                      <thead>
                        <tr className="border-b border-border bg-secondary/50">
                          <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">Algorithme</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">Type</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">Complexité</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">Données requises</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">Forces</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">Faiblesses</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mlAlgorithmCompare.map((algo, i) => (
                          <tr
                            key={algo.name}
                            className={`border-b border-border/50 transition-colors hover:bg-secondary/30 ${
                              i % 2 === 0 ? 'bg-background' : 'bg-secondary/10'
                            }`}
                          >
                            <td className="px-4 py-3 font-semibold whitespace-nowrap">{algo.name}</td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <Badge variant="outline" className={`text-[11px] px-2 py-0.5 border ${typeBadgeColors[algo.typeBadge] || ''}`}>
                                {algo.type}
                              </Badge>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${complexityColors[algo.complexity]}`}>
                                <span className={`w-2 h-2 rounded-full ${algo.complexity === 'Facile' ? 'bg-emerald-400' : algo.complexity === 'Moyen' ? 'bg-amber-400' : 'bg-red-400'}`} />
                                {algo.complexity}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-muted-foreground whitespace-nowrap text-xs">{algo.dataNeeded}</td>
                            <td className="px-4 py-3">
                              <div className="flex flex-wrap gap-1">
                                {algo.forces.map((f) => (
                                  <span key={f} className="inline-block text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 whitespace-nowrap">
                                    {f}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex flex-wrap gap-1">
                                {algo.faiblesses.map((f) => (
                                  <span key={f} className="inline-block text-[10px] px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20 whitespace-nowrap">
                                    {f}
                                  </span>
                                ))}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {/* Legend */}
                  <div className="px-4 pt-3 flex flex-wrap gap-4 text-[11px] text-muted-foreground border-t border-border/50 mt-1">
                    <span className="flex items-center gap-1.5">
                      <Badge variant="outline" className={`text-[10px] px-1.5 py-0 border ${typeBadgeColors['Classification']}`}>Classification</Badge>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Badge variant="outline" className={`text-[10px] px-1.5 py-0 border ${typeBadgeColors['Régression']}`}>Régression</Badge>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Badge variant="outline" className={`text-[10px] px-1.5 py-0 border ${typeBadgeColors['Temporel']}`}>Temporel</Badge>
                    </span>
                    <span className="flex items-center gap-1.5 ml-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" /> Facile
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-400" /> Moyen
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-red-400" /> Élevé
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* TP Search & Filter Bar */}
              <div className="mb-6 space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    value={tpSearch}
                    onChange={(e) => setTpSearch(e.target.value)}
                    placeholder="Rechercher par titre, description ou tags..."
                    className="pl-10 pr-9 bg-secondary/30 border-border input-glow-focus"
                  />
                  {tpSearch && (
                    <button
                      onClick={() => setTpSearch('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      aria-label="Effacer la recherche"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs text-muted-foreground mr-1">Catégorie :</span>
                    {['Favoris', 'Tous', 'Classification', 'Régression', 'Séries Temporelles', 'Clustering'].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setTpCategoryFilter(cat)}
                        className={`chip-hover px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 flex items-center gap-1.5 ${
                          tpCategoryFilter === cat
                            ? 'glass-chip indigo'
                            : 'bg-secondary/50 text-muted-foreground hover:text-foreground border border-transparent hover:border-border'
                        }`}
                      >
                        {tpCategoryFilter === cat && <span className="glow-dot indigo" />}
                        {cat === 'Favoris' && <Star className="w-3 h-3 text-amber-400" />}
                        {cat}
                        {cat === 'Favoris' && bookmarkedTps.length > 0 && (
                          <Badge className="h-4 min-w-4 px-1 flex items-center justify-center text-[9px] font-bold bg-amber-500/20 text-amber-400 border-0">{bookmarkedTps.length}</Badge>
                        )}
                      </button>
                    ))}
                  </div>
                  <div className="w-px h-5 bg-border hidden sm:block" />
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs text-muted-foreground mr-1">Niveau :</span>
                    {['Tous', 'Débutant', 'Intermédiaire', 'Avancé'].map((diff) => (
                      <button
                        key={diff}
                        onClick={() => setTpDifficultyFilter(diff)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 tag-outline glass-chip ${
                          tpDifficultyFilter === diff
                            ? 'bg-primary/20 text-foreground border border-primary/30'
                            : 'bg-secondary/50 text-muted-foreground hover:text-foreground border border-transparent hover:border-border'
                        }`}
                      >
                        {diff}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* TP Cards */}
              {tpsLoading ? (
                <div className="grid sm:grid-cols-2 gap-6">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="glass-card rounded-xl p-6 animate-pulse">
                      <div className="h-6 bg-secondary rounded w-1/2 mb-4" />
                      <div className="h-4 bg-secondary rounded w-full mb-2" />
                      <div className="h-4 bg-secondary rounded w-3/4 mb-4" />
                      <div className="flex gap-2">
                        <div className="h-6 bg-secondary rounded w-20" />
                        <div className="h-6 bg-secondary rounded w-16" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : tps.length === 0 ? (
                <Card className="glass-card">
                  <CardContent className="py-16 text-center">
                    <FlaskConical className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Aucun TP trouvé</h3>
                    <p className="text-muted-foreground mb-4">Ajoutez votre premier TP ou réinitialisez la base de données.</p>
                    <Button onClick={seedDatabase} variant="outline">
                      <RotateCcw className="w-4 h-4 mr-2" /> Charger les TPs par défaut
                    </Button>
                  </CardContent>
                </Card>
              ) : (() => {
                // Filter TPs
                const filteredTps = tps.filter((tp) => {
                  const searchLower = tpSearch.toLowerCase();
                  const matchesSearch = !tpSearch ||
                    tp.title.toLowerCase().includes(searchLower) ||
                    tp.description.toLowerCase().includes(searchLower) ||
                    tp.tags.toLowerCase().includes(searchLower);
                  const matchesCategory = tpCategoryFilter === 'Tous' || tpCategoryFilter === 'Favoris'
                    ? (tpCategoryFilter === 'Favoris' ? bookmarkedTps.includes(tp.id) : true)
                    : tp.category === tpCategoryFilter;
                  const matchesDifficulty = tpDifficultyFilter === 'Tous' || tp.difficulty === tpDifficultyFilter;
                  return matchesSearch && matchesCategory && matchesDifficulty;
                });

                return (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">{filteredTps.length} TP(s) trouvé{filteredTps.length !== 1 ? 's' : ''}</p>
                    <div className="grid sm:grid-cols-2 gap-6">
                      {filteredTps.map((tp) => {
                        const steps: string[] = JSON.parse(tp.steps || '[]');
                        const concepts: string[] = JSON.parse(tp.concepts || '[]');
                        const tags: string[] = JSON.parse(tp.tags || '[]');
                        const isExpanded = expandedTp === tp.id;

                        const categoryColorMap: Record<string, string> = {
                          'Classification': '#6366f1',
                          'Régression': '#10b981',
                          'Séries Temporelles': '#8b5cf6',
                          'Clustering': '#f59e0b',
                        };
                        const catColor = categoryColorMap[tp.category] || tp.color || '#6366f1';
                        const difficultyColor = tp.difficulty === 'Débutant' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : tp.difficulty === 'Avancé' ? 'bg-red-500/10 text-red-400 border-red-500/20'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/20';

                        return (
                          <motion.div
                            key={tp.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            layout
                          >
                            <Card
                              className={`glass-card hover-card-lift hover-scale-glow transition-all duration-300 cursor-pointer overflow-hidden hover-scale-sm ${isExpanded ? 'sm:col-span-2 ring-1 ring-primary/20' : ''}`}
                              onClick={() => setExpandedTp(isExpanded ? null : tp.id)}
                            >
                              {/* Card Header (always visible) */}
                              <CardHeader className="pb-0">
                                <div className="flex items-start justify-between gap-2">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <Badge
                                      className="border font-semibold text-white text-xs"
                                      style={{ backgroundColor: catColor, borderColor: catColor }}
                                    >
                                      TP {tp.order ?? ''}
                                    </Badge>
                                    <Badge
                                      className="border text-xs"
                                      style={{ backgroundColor: `${catColor}20`, color: catColor, borderColor: `${catColor}40` }}
                                      variant="outline"
                                    >
                                      {tp.category}
                                    </Badge>
                                    <Badge className={`${difficultyColor} border text-xs`} variant="outline">{tp.difficulty}</Badge>
                                  </div>
                                  <div className="flex items-center gap-1 shrink-0">
                                    <button
                                      onClick={(e) => { e.stopPropagation(); toggleBookmark(tp.id); }}
                                      className="p-1 rounded hover:bg-secondary/80 transition-colors tooltip-float"
                                      data-tooltip={bookmarkedTps.includes(tp.id) ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                                      aria-label={bookmarkedTps.includes(tp.id) ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                                    >
                                      <Bookmark className={`w-4 h-4 transition-colors ${bookmarkedTps.includes(tp.id) ? 'text-amber-400 fill-amber-400' : 'text-muted-foreground'}`} />
                                    </button>
                                    {isAdminAuthenticated && isExpanded && (
                                      <button
                                        onClick={(e) => { e.stopPropagation(); handleEditTp(tp); }}
                                        className="p-1 rounded hover:bg-secondary/80 transition-colors"
                                        aria-label="Modifier le TP"
                                      >
                                        <Pencil className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                                      </button>
                                    )}
                                    {tp.duration && (
                                      <span className="flex items-center gap-1 text-xs text-muted-foreground mr-1">
                                        <Clock className="w-3 h-3" />{tp.duration}
                                      </span>
                                    )}
                                    <motion.div
                                      animate={{ rotate: isExpanded ? 180 : 0 }}
                                      transition={{ duration: 0.2 }}
                                    >
                                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                                    </motion.div>
                                  </div>
                                </div>
                                <CardTitle className="text-xl mt-3" style={{ borderLeft: `3px solid ${catColor}`, paddingLeft: '0.75rem' }}>
                                  {tp.title}
                                </CardTitle>
                                <CardDescription className="line-clamp-3">{tp.description}</CardDescription>

                                {/* Notebook indicator row - always visible */}
                                {tp.notebooks && tp.notebooks.length > 0 && (
                                  <div className="mt-3 flex items-center gap-2 flex-wrap" onClick={(e) => e.stopPropagation()}>
                                    <span className="inline-flex items-center gap-1.5 text-xs text-purple-400 font-medium">
                                      <FileCode2 className="w-3.5 h-3.5" />
                                      {tp.notebooks.length} Notebook{tp.notebooks.length > 1 ? 's' : ''}
                                    </span>
                                    {tp.notebooks.slice(0, 2).map((nb: { id: string; title: string; fileName: string; fileSize: number }) => {
                                      const colabUrl = `https://colab.research.google.com/github/MAALOUFimad02/Machine_Learning_Training/blob/main/notebooks/${nb.fileName}`;
                                      return (
                                        <a
                                          key={nb.id}
                                          href={colabUrl}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors text-xs font-semibold"
                                          title={`Ouvrir "${nb.title || nb.fileName}" dans Google Colab`}
                                        >
                                          <ExternalLink className="w-3 h-3" />
                                          Colab
                                        </a>
                                      );
                                    })}
                                    {tp.notebooks.length > 2 && (
                                      <span className="text-xs text-muted-foreground">+{tp.notebooks.length - 2} autre{tp.notebooks.length - 2 > 1 ? 's' : ''}</span>
                                    )}
                                  </div>
                                )}
                              </CardHeader>

                              {/* Always-visible notebook action buttons */}
                              {tp.notebooks && tp.notebooks.length > 0 && (
                                <div className="px-6 pb-2 flex flex-wrap gap-2" onClick={(e) => e.stopPropagation()}>
                                  {tp.notebooks.map((nb: { id: string; title: string; fileName: string; fileSize: number }) => {
                                    const colabUrl = `https://colab.research.google.com/github/MAALOUFimad02/Machine_Learning_Training/blob/main/notebooks/${nb.fileName}`;
                                    return (
                                      <div key={nb.id} className="flex items-center gap-1.5">
                                        <Button
                                          size="sm"
                                          className="text-xs bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border border-blue-500/20 hover:border-blue-500/30"
                                          variant="outline"
                                          asChild
                                        >
                                          <a href={colabUrl} target="_blank" rel="noopener noreferrer">
                                            <ExternalLink className="w-3.5 h-3.5 mr-1" />
                                            Ouvrir dans Colab
                                          </a>
                                        </Button>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          className="text-xs border-border"
                                          asChild
                                        >
                                          <a href={`/api/notebooks/download?id=${nb.id}`} target="_blank" rel="noopener noreferrer">
                                            <Download className="w-3.5 h-3.5 mr-1" />
                                            Télécharger
                                          </a>
                                        </Button>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}

                              {/* Collapsible Content */}
                              <AnimatePresence>
                                {isExpanded && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                                    className="overflow-hidden"
                                  >
                                    <CardContent className="pt-4 space-y-5">
                                      {/* Dataset Info Row */}
                                      {(tp.datasetName || tp.datasetRows) && (
                                        <div className="flex flex-wrap items-center gap-4 bg-secondary/30 rounded-lg p-3 text-sm">
                                          {tp.datasetName && (
                                            <span className="flex items-center gap-1.5 text-muted-foreground">
                                              <Database className="w-3.5 h-3.5 text-primary-foreground" />
                                              <span className="font-medium text-foreground">{tp.datasetName}</span>
                                            </span>
                                          )}
                                          {tp.datasetRows && (
                                            <span className="flex items-center gap-1.5 text-muted-foreground">
                                              <Layers className="w-3.5 h-3.5 text-primary-foreground" />
                                              <span className="font-medium text-foreground">{tp.datasetRows}</span> lignes × <span className="font-medium text-foreground">{tp.datasetCols}</span> colonnes
                                            </span>
                                          )}
                                        </div>
                                      )}

                                      {/* Objective */}
                                      {tp.objective && (
                                        <div className="bg-primary/5 border border-primary/10 rounded-lg p-3">
                                          <h4 className="text-xs font-semibold text-primary-foreground uppercase tracking-wider mb-1">Objectif</h4>
                                          <p className="text-sm text-muted-foreground">{tp.objective}</p>
                                        </div>
                                      )}

                                      {/* Star Rating */}
                                      <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-0.5">
                                          {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                              key={star}
                                              type="button"
                                              onClick={(e) => { e.stopPropagation(); setTpRating(tp.id, star); }}
                                              className="p-0.5 transition-transform hover:scale-125 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                                              aria-label={`Noter ${star} étoile${star > 1 ? 's' : ''}`}
                                            >
                                              <Star
                                                className={`w-5 h-5 transition-colors ${
                                                  tpRatings[tp.id] && star <= tpRatings[tp.id]
                                                    ? 'text-amber-400 fill-amber-400'
                                                    : 'text-muted-foreground/40'
                                                }`}
                                              />
                                            </button>
                                          ))}
                                        </div>
                                        {tpRatings[tp.id] && (
                                          <span className="text-xs text-muted-foreground font-medium">{tpRatings[tp.id]}/5</span>
                                        )}
                                      </div>

                                      {/* Steps as Timeline */}
                                      {steps.length > 0 && (
                                        <div>
                                          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Étapes ({steps.length})</h4>
                                          <div className="relative pl-6 space-y-3">
                                            <div className="absolute left-[9px] top-2 bottom-2 w-px bg-border" />
                                            {steps.map((step, i) => (
                                              <div key={i} className="relative flex items-start gap-3">
                                                <div className="absolute -left-6 top-0.5 w-[18px] h-[18px] rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center shrink-0">
                                                  <span className="text-[9px] font-bold text-white">{i + 1}</span>
                                                </div>
                                                <p className="text-sm text-muted-foreground leading-relaxed">{step}</p>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      )}

                                      {/* Concepts as Badges */}
                                      {concepts.length > 0 && (
                                        <div>
                                          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Concepts</h4>
                                          <div className="flex flex-wrap gap-2">
                                            {concepts.map((c, i) => (
                                              <Badge key={i} variant="outline" className="text-xs glass-tag indigo">{c}</Badge>
                                            ))}
                                          </div>
                                        </div>
                                      )}

                                      {/* Tags */}
                                      {tags.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5">
                                          {tags.map((t, i) => (
                                            <span key={i} className="text-[10px] text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded-full">#{t}</span>
                                          ))}
                                        </div>
                                      )}

                                      {/* Expected Result */}
                                      {tp.expectedResult && (
                                        <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-lg p-3">
                                          <h4 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">Résultat attendu</h4>
                                          <p className="text-sm text-muted-foreground">{tp.expectedResult}</p>
                                        </div>
                                      )}

                                      {/* Notebooks section - Enhanced */}
                                      {tp.notebooks && tp.notebooks.length > 0 && (
                                        <div className="space-y-3">
                                          <h4 className="text-sm font-semibold flex items-center gap-2">
                                            <FileCode2 className="w-4 h-4 text-purple-400" /> Notebooks ({tp.notebooks.length})
                                          </h4>
                                          <div className="space-y-2">
                                            {tp.notebooks.map((nb: { id: string; title: string; fileName: string; fileSize: number; filePath?: string }) => {
                                              const colabUrl = `https://colab.research.google.com/github/MAALOUFimad02/Machine_Learning_Training/blob/main/notebooks/${nb.fileName}`;
                                              return (
                                                <div key={nb.id} className="p-3 rounded-lg bg-purple-500/5 border border-purple-500/10 hover:bg-purple-500/10 transition-colors" onClick={(e) => e.stopPropagation()}>
                                                  <div className="flex items-center gap-2 mb-2">
                                                    <FileText className="w-5 h-5 text-purple-400 shrink-0" />
                                                    <span className="font-medium text-sm truncate">{nb.title || nb.fileName}</span>
                                                    <span className="text-xs text-muted-foreground shrink-0 ml-auto">
                                                      {(nb.fileSize / 1024).toFixed(1)} Ko
                                                    </span>
                                                  </div>
                                                  <div className="flex items-center gap-2">
                                                    <a
                                                      href={colabUrl}
                                                      target="_blank"
                                                      rel="noopener noreferrer"
                                                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors text-xs font-semibold shrink-0"
                                                      title="Ouvrir dans Google Colab"
                                                    >
                                                      <ExternalLink className="w-3.5 h-3.5" />
                                                      Ouvrir dans Colab
                                                    </a>
                                                    <a
                                                      href={`/api/notebooks/download?id=${nb.id}`}
                                                      target="_blank"
                                                      rel="noopener noreferrer"
                                                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors text-xs font-medium shrink-0"
                                                      title="Télécharger le notebook"
                                                    >
                                                      <Download className="w-3.5 h-3.5" />
                                                      Télécharger
                                                    </a>
                                                  </div>
                                                </div>
                                              );
                                            })}
                                          </div>
                                        </div>
                                      )}
                                    </CardContent>

                                    {/* Footer - legacy links and admin actions */}
                                    <CardFooter className="gap-2 pt-0 flex-wrap">
                                      {/* Legacy Colab/Kaggle URL buttons */}
                                      {tp.colabUrl && !tp.notebooks?.length && (
                                        <Button variant="outline" size="sm" className="text-xs border-border" asChild onClick={(e) => e.stopPropagation()}>
                                          <a href={tp.colabUrl} target="_blank" rel="noopener noreferrer">
                                            <FileCode2 className="w-3 h-3 mr-1" /> Colab <ExternalLink className="w-3 h-3 ml-1" />
                                          </a>
                                        </Button>
                                      )}
                                      {tp.kaggleUrl && (
                                        <Button variant="outline" size="sm" className="text-xs border-border" asChild onClick={(e) => e.stopPropagation()}>
                                          <a href={tp.kaggleUrl} target="_blank" rel="noopener noreferrer">
                                            <Database className="w-3 h-3 mr-1" /> Kaggle <ExternalLink className="w-3 h-3 ml-1" />
                                          </a>
                                        </Button>
                                      )}
                                      <div className="flex-1" />
                                      {isAdminAuthenticated && (
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-xs text-muted-foreground hover:text-destructive"
                                        onClick={(e) => { e.stopPropagation(); deleteTp(tp.id); }}
                                      >
                                        <Trash2 className="w-3 h-3 mr-1" /> Supprimer
                                      </Button>
                                      )}
                                    </CardFooter>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </Card>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          )}

          {/* ═══════ CONTACT TAB ═══════ */}
          {activeTab === 'contact' && (
            <motion.div
              key="contact"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12"
            >
              <div className="text-center mb-10">
                <h1 className="text-3xl sm:text-4xl font-bold mb-3">
                  <span className="gradient-text">Contactez</span>-nous
                </h1>
                <p className="text-muted-foreground">
                  Une question ou une suggestion ? N&apos;hésitez pas à nous écrire.
                </p>
              </div>

              <div className="grid lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {/* Contact Form */}
                <div className="lg:col-span-2">
                  <Card className="glass-card animate-fade-in-up normal">
                    <CardHeader>
                      <CardTitle>Envoyer un message</CardTitle>
                      <CardDescription>Remplissez le formulaire ci-dessous et nous vous répondrons dans les plus brefs délais.</CardDescription>
                    </CardHeader>
                    {contactSuccess ? (
                      <CardContent className="py-10">
                        <div className="text-center space-y-4">
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                            className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto"
                          >
                            <CheckCircle2 className="w-9 h-9 text-emerald-400" />
                          </motion.div>
                          <h3 className="text-xl font-bold gradient-text">Message envoyé avec succès !</h3>
                          {contactSuccess.emailSent && (
                            <p className="text-sm text-muted-foreground">
                              Un accusé de réception a été envoyé à votre adresse email.
                            </p>
                          {
                            icon: <Send className="w-8 h-8" />,
                            title: 'Retour & Support',
                            desc: "Posez vos questions et améliorez votre expérience d'apprentissage.",
                            tab: 'contact' as TabId,
                            color: 'from-amber-500 to-orange-500',
                          },
                            variant="outline"
                            onClick={resetContactForm}
                            className="mt-4"
                          >
                            <Send className="w-4 h-4 mr-2" />
                            Envoyer un autre message
                          </Button>
                        </div>
                      </CardContent>
                    ) : (
                      <>
                        <CardContent className="space-y-4">
                          <div className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Nom <span className="text-red-400">*</span></Label>
                              <Input
                                value={contactForm.name}
                                onChange={(e) => { setContactForm({ ...contactForm, name: e.target.value }); if (contactErrors.name) setContactErrors(prev => ({ ...prev, name: '' })); }}
                                placeholder="Votre nom"
                                className={`glass-input ${contactErrors.name ? 'border-red-500/60 focus-visible:ring-red-500/30' : ''}`}
                              />
                              {contactErrors.name && <p className="text-xs text-red-400">{contactErrors.name}</p>}
                            </div>
                            <div className="space-y-2">
                              <Label>Email <span className="text-red-400">*</span></Label>
                              <Input
                                type="email"
                                value={contactForm.email}
                                onChange={(e) => { setContactForm({ ...contactForm, email: e.target.value }); if (contactErrors.email) setContactErrors(prev => ({ ...prev, email: '' })); }}
                                placeholder="votre@email.com"
                                className={`glass-input ${contactErrors.email ? 'border-red-500/60 focus-visible:ring-red-500/30' : ''}`}
                              />
                              {contactErrors.email && <p className="text-xs text-red-400">{contactErrors.email}</p>}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label>Sujet <span className="text-red-400">*</span></Label>
                            <Input
                              value={contactForm.subject}
                              onChange={(e) => { setContactForm({ ...contactForm, subject: e.target.value }); if (contactErrors.subject) setContactErrors(prev => ({ ...prev, subject: '' })); }}
                              placeholder="Sujet de votre message"
                              className={`glass-input ${contactErrors.subject ? 'border-red-500/60 focus-visible:ring-red-500/30' : ''}`}
                            />
                            {contactErrors.subject && <p className="text-xs text-red-400">{contactErrors.subject}</p>}
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label>Message <span className="text-red-400">*</span></Label>
                              <span className={`text-xs ${contactForm.message.length > 5000 ? 'text-red-400' : 'text-muted-foreground'}`}>
                                {contactForm.message.length}/5000
                              </span>
                            </div>
                            <Textarea
                              value={contactForm.message}
                              onChange={(e) => { if (e.target.value.length <= 5000) { setContactForm({ ...contactForm, message: e.target.value }); } if (contactErrors.message) setContactErrors(prev => ({ ...prev, message: '' })); }}
                              placeholder="Votre message..."
                              rows={5}
                              className={`glass-input ${contactErrors.message ? 'border-red-500/60 focus-visible:ring-red-500/30' : ''}`}
                            />
                            {contactErrors.message && <p className="text-xs text-red-400">{contactErrors.message}</p>}
                          </div>
                          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                            <Mail className="w-3 h-3" />
                            Votre message sera envoyé par email à l&apos;équipe IA Academy. Vous recevrez un accusé de réception.
                          </p>
                        </CardContent>
                        <CardFooter>
                          <Button
                            onClick={submitContact}
                            disabled={contactSending}
                            className="bg-gradient-to-r from-primary to-purple-500 text-white hover:from-primary/90 hover:to-purple-500/90"
                          >
                            {contactSending ? (
                              <>Envoi en cours...</>
                            ) : (
                              <>
                                <Send className="w-4 h-4 mr-2" />
                                Envoyer le message
                              </>
                            )}
                          </Button>
                        </CardFooter>
                      </>
                    )}
                  </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Contact Info */}
                  <Card className="glass-card">
                    <CardHeader>
                      <CardTitle className="text-lg">Informations</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Mail className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Email</p>
                          <p className="text-xs text-muted-foreground">imadmaalouf02@gmail.com</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                          <Github className="w-5 h-5 text-foreground" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">GitHub</p>
                          <p className="text-xs text-muted-foreground">github.com/imadmaalouf02</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                          <Zap className="w-5 h-5 text-amber-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">HuggingFace</p>
                          <p className="text-xs text-muted-foreground">huggingface.co/MAALOUFimad02</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* FAQ */}
                  <Card className="glass-card">
                    <CardHeader>
                      <CardTitle className="text-lg">Questions Fréquentes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="q1">
                          <AccordionTrigger className="text-sm">Ai-je besoin de connaissances préalables ?</AccordionTrigger>
                          <AccordionContent className="text-xs text-muted-foreground">
                            Des bases en Python et en mathématiques (algèbre linéaire, probabilités) sont recommandées mais pas obligatoires. Les cours commencent par les fondamentaux.
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="q2">
                          <AccordionTrigger className="text-sm">Quels outils sont nécessaires ?</AccordionTrigger>
                          <AccordionContent className="text-xs text-muted-foreground">
                            Python 3.8+, Google Colab (gratuit), et les bibliothèques scikit-learn, TensorFlow/Keras, pandas, numpy. Tout peut être exécuté dans le navigateur avec Colab.
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="q3">
                          <AccordionTrigger className="text-sm">Les TPs sont-ils notés ?</AccordionTrigger>
                          <AccordionContent className="text-xs text-muted-foreground">
                            Les TPs sont des exercices d&apos;apprentissage. Vous pouvez les réaliser à votre rythme.
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </motion.div>
          )}

          {/* ─── Admin Tab ───────────────────────────────────────── */}
          {activeTab === 'admin' && (
            <motion.div
              key="admin"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12"
            >
              <div className="text-center mb-10">
                <h1 className="text-3xl sm:text-4xl font-bold mb-3">
                  <span className="gradient-text">Administration</span>
                </h1>
                <p className="text-muted-foreground">
                  Gestion des notebooks, messages et statistiques
                </p>
              </div>

              {!isAdminAuthenticated ? (
                /* Admin Login */
                <Card className="glass-card max-w-sm mx-auto">
                  <CardHeader className="text-center">
                    <div className="w-14 h-14 rounded-full bg-amber-500/20 flex items-center justify-center mx-auto mb-3">
                      <Lock className="w-7 h-7 text-amber-400" />
                    </div>
                    <CardTitle>Accès Administrateur</CardTitle>
                    <CardDescription>Entrez vos identifiants pour accéder au panneau d&apos;administration.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input
                        type="email"
                        value={adminEmail}
                        onChange={(e) => { setAdminEmail(e.target.value); setAdminLoginError(''); }}
                        onKeyDown={(e) => e.key === 'Enter' && adminLogin()}
                        placeholder="admin@example.com"
                        className="glass-input"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Mot de passe</Label>
                      <Input
                        type="password"
                        value={adminPassword}
                        onChange={(e) => { setAdminPassword(e.target.value); setAdminLoginError(''); }}
                        onKeyDown={(e) => e.key === 'Enter' && adminLogin()}
                        placeholder="Mot de passe..."
                        className="glass-input"
                      />
                      {adminLoginError && <p className="text-xs text-red-400 flex items-center gap-1">{adminLoginLockedUntil && Date.now() < adminLoginLockedUntil ? <Shield className="w-3 h-3" /> : null}{adminLoginError}</p>}
                    </div>
                    <Button
                      onClick={adminLogin}
                      disabled={adminLoginLoading || (adminLoginLockedUntil > 0 && Date.now() < adminLoginLockedUntil)}
                      className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-500/90 hover:to-orange-500/90"
                    >
                      {adminLoginLoading ? (
                        <>Connexion...</>
                      ) : (
                        <>
                          <Shield className="w-4 h-4 mr-2" />
                          Se connecter
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                /* Admin Dashboard */
                <div className="space-y-6">
                  {/* Admin Header */}
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex bg-secondary/50 rounded-lg p-1 gap-1">
                        {([
                          { id: 'stats' as const, label: 'Statistiques', icon: BarChart3 },
                          { id: 'notebooks' as const, label: 'Notebooks', icon: FileText },
                          { id: 'chapters' as const, label: 'Chapitres', icon: Layers },
                          { id: 'messages' as const, label: 'Messages', icon: MessageSquare },
                          { id: 'settings' as const, label: 'Notifications', icon: Settings },
                        ]).map((tab) => {
                          const Icon = tab.icon;
                          return (
                            <button
                              key={tab.id}
                              onClick={() => setAdminTab(tab.id)}
                              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                                adminTab === tab.id
                                  ? 'bg-primary text-primary-foreground shadow-sm'
                                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                              }`}
                            >
                              <Icon className="w-4 h-4" />
                              <span className="hidden sm:inline">{tab.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={adminLogout}>
                      <Lock className="w-4 h-4 mr-2" />
                      Déconnexion
                    </Button>
                  </div>

                  {/* Stats Tab */}
                  {adminTab === 'stats' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
                      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <Card className="glass-card">
                          <CardContent className="p-6">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Inbox className="w-5 h-5 text-primary-foreground" />
                              </div>
                              <div>
                                <p className="text-2xl font-bold">{adminFeedbacks.length}</p>
                                <p className="text-xs text-muted-foreground">Messages totaux</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        <Card className="glass-card">
                          <CardContent className="p-6">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                                <MessageSquare className="w-5 h-5 text-amber-400" />
                              </div>
                              <div>
                                <p className="text-2xl font-bold">{adminFeedbacks.filter(f => !f.read).length}</p>
                                <p className="text-xs text-muted-foreground">Messages non lus</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        <Card className="glass-card">
                          <CardContent className="p-6">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                                <FileText className="w-5 h-5 text-emerald-400" />
                              </div>
                              <div>
                                <p className="text-2xl font-bold">{adminNotebooks.length}</p>
                                <p className="text-xs text-muted-foreground">Notebooks totaux</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        <Card className="glass-card">
                          <CardContent className="p-6">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                                <Eye className="w-5 h-5 text-purple-400" />
                              </div>
                              <div>
                                <p className="text-2xl font-bold">{adminNotebooks.filter(n => n.visible).length}</p>
                                <p className="text-xs text-muted-foreground">Notebooks visibles</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Activity Feed */}
                      <Card className="glass-card">
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Activity className="w-5 h-5 text-emerald-400" />
                            Journal d&apos;Activité
                          </CardTitle>
                          <CardDescription>Dernières actions des utilisateurs</CardDescription>
                        </CardHeader>
                        <CardContent>
                          {activityLog.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-6">Aucune activité enregistrée.</p>
                          ) : (
                            <div className="space-y-0">
                              {(showAllActivity ? activityLog : activityLog.slice(0, 10)).map((entry, idx) => {
                                const IconComponent = entry.icon === 'BookOpen' ? BookOpen
                                  : entry.icon === 'Brain' ? Brain
                                  : entry.icon === 'Bookmark' ? Bookmark
                                  : StickyNote;
                                return (
                                  <motion.div
                                    key={entry.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.03 }}
                                    className="flex items-start gap-3 py-3 border-b border-border/50 last:border-0"
                                  >
                                    <div className="w-8 h-8 rounded-full bg-secondary/60 flex items-center justify-center shrink-0 mt-0.5">
                                      <IconComponent className="w-4 h-4 text-muted-foreground" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium truncate">{entry.action}</p>
                                      <p className="text-xs text-muted-foreground truncate">{entry.detail}</p>
                                    </div>
                                    <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0">
                                      {formatRelativeTime(entry.timestamp)}
                                    </span>
                                  </motion.div>
                                );
                              })}
                            </div>
                          )}
                          {activityLog.length > 10 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-full mt-3 text-muted-foreground hover:text-foreground"
                              onClick={() => setShowAllActivity(prev => !prev)}
                            >
                              {showAllActivity ? 'Voir moins' : `Voir tout (${activityLog.length} entrées)`}
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}

                  {/* Notebooks Tab */}
                  {adminTab === 'notebooks' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="space-y-6">
                      {/* Upload Form */}
                      <Card className="glass-card">
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Upload className="w-5 h-5" />
                            Télécharger un Notebook
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Titre <span className="text-red-400">*</span></Label>
                              <Input
                                value={adminNewNotebook.title}
                                onChange={(e) => setAdminNewNotebook(prev => ({ ...prev, title: e.target.value }))}
                                placeholder="Titre du notebook"
                                className="glass-input"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Chapitre</Label>
                              <Select value={adminNewNotebook.chapter} onValueChange={(v) => setAdminNewNotebook(prev => ({ ...prev, chapter: v }))}>
                                <SelectTrigger className="glass-input">
                                  <SelectValue placeholder="Sélectionner un chapitre" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="intro">Introduction au ML</SelectItem>
                                  <SelectItem value="regression">Régression Linéaire</SelectItem>
                                  <SelectItem value="logistique">Régression Logistique</SelectItem>
                                  <SelectItem value="randomforest">Random Forest</SelectItem>
                                  <SelectItem value="neural">Réseaux de Neurones</SelectItem>
                                  <SelectItem value="lstm">LSTM & Séries Temporelles</SelectItem>
                                  <SelectItem value="metriques">Métriques de Performance</SelectItem>
                                  <SelectItem value="optimisation">Optimisation</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea
                              value={adminNewNotebook.description}
                              onChange={(e) => setAdminNewNotebook(prev => ({ ...prev, description: e.target.value }))}
                              placeholder="Description du notebook..."
                              rows={2}
                              className="glass-input"
                            />
                          </div>
                          <div className="flex flex-wrap items-end gap-4">
                            <div className="flex-1 min-w-[200px] space-y-2">
                              <Label>Fichier <span className="text-red-400">*</span></Label>
                              <div className="flex items-center gap-2">
                                <Input
                                  type="file"
                                  accept=".ipynb,.py,.json"
                                  onChange={(e) => setAdminNewNotebook(prev => ({ ...prev, file: e.target.files?.[0] || null }))}
                                  className="glass-input text-sm"
                                />
                              </div>
                              <p className="text-xs text-muted-foreground">Formats acceptés : .ipynb, .py, .json (max 50 Mo)</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Label className="text-sm">Visible</Label>
                              <button
                                onClick={() => setAdminNewNotebook(prev => ({ ...prev, visible: prev.visible === 'true' ? 'false' : 'true' }))}
                                className={`w-10 h-6 rounded-full transition-colors relative ${adminNewNotebook.visible === 'true' ? 'bg-emerald-500' : 'bg-secondary'}`}
                                aria-label="Toggle visibilité"
                              >
                                <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${adminNewNotebook.visible === 'true' ? 'translate-x-5' : 'translate-x-1'}`} />
                              </button>
                            </div>
                          </div>
                          <Button
                            onClick={uploadNotebook}
                            disabled={adminUploading || !adminNewNotebook.file || !adminNewNotebook.title.trim()}
                            className="bg-gradient-to-r from-primary to-purple-500 text-white hover:from-primary/90 hover:to-purple-500/90"
                          >
                            {adminUploading ? (
                              <>Téléchargement...</>
                            ) : (
                              <>
                                <Upload className="w-4 h-4 mr-2" />
                                Télécharger
                              </>
                            )}
                          </Button>
                        </CardContent>
                      </Card>

                      {/* Notebooks List */}
                      <Card className="glass-card">
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center gap-2">
                            <FileCode2 className="w-5 h-5" />
                            Notebooks ({adminNotebooks.length})
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          {adminNotebooks.length === 0 ? (
                            <div className="text-center py-12 text-muted-foreground">
                              <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
                              <p className="text-sm">Aucun notebook téléchargé</p>
                            </div>
                          ) : (
                            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                              {adminNotebooks.map((nb) => (
                                <div key={nb.id} className="flex items-center gap-4 p-3 rounded-lg bg-secondary/30 border border-border hover:border-border/80 transition-colors">
                                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                    <FileCode2 className="w-5 h-5 text-primary-foreground" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                      <p className="text-sm font-medium truncate">{nb.title}</p>
                                      <Badge variant={nb.visible ? 'default' : 'secondary'} className="shrink-0 text-[10px]">
                                        {nb.visible ? 'Visible' : 'Masqué'}
                                      </Badge>
                                    </div>
                                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                                      <span className="truncate">{nb.fileName}</span>
                                      <span>{formatFileSize(nb.fileSize)}</span>
                                      {nb.chapter && <span className="text-primary-foreground/70">{courseSections.find(s => s.id === nb.chapter)?.title || nb.chapter}</span>}
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-1 shrink-0">
                                    <button
                                      onClick={() => window.open(`/api/notebooks/download?id=${nb.id}`, '_blank')}
                                      className="w-8 h-8 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                                      aria-label="Télécharger"
                                    >
                                      <Download className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => toggleNotebookVisibility(nb.id, nb.visible)}
                                      className="w-8 h-8 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                                      aria-label={nb.visible ? 'Masquer' : 'Rendre visible'}
                                    >
                                      {nb.visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                    <button
                                      onClick={() => deleteNotebook(nb.id)}
                                      className="w-8 h-8 rounded-md flex items-center justify-center text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-colors"
                                      aria-label="Supprimer"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}

                  {/* Messages Tab */}
                  {adminTab === 'messages' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
                      <Card className="glass-card">
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Inbox className="w-5 h-5" />
                            Messages
                            {adminFeedbacks.filter(f => !f.read).length > 0 && (
                              <Badge variant="destructive" className="text-[10px]">
                                {adminFeedbacks.filter(f => !f.read).length} non lu{adminFeedbacks.filter(f => !f.read).length > 1 ? 's' : ''}
                              </Badge>
                            )}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          {adminFeedbacks.length === 0 ? (
                            <div className="text-center py-12 text-muted-foreground">
                              <Inbox className="w-12 h-12 mx-auto mb-3 opacity-30" />
                              <p className="text-sm">Aucun message reçu</p>
                            </div>
                          ) : (
                            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                              {adminFeedbacks.map((fb) => (
                                <div key={fb.id} className="rounded-lg border border-border overflow-hidden bg-secondary/20">
                                  <button
                                    onClick={() => setExpandedFeedback(expandedFeedback === fb.id ? null : fb.id)}
                                    className="w-full text-left p-4 hover:bg-secondary/40 transition-colors"
                                  >
                                    <div className="flex items-start gap-3">
                                      <div className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${fb.read ? 'bg-muted-foreground/30' : 'bg-amber-400'}`} />
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                          <p className={`text-sm ${fb.read ? 'text-muted-foreground' : 'font-medium text-foreground'}`}>{fb.name}</p>
                                          <span className="text-xs text-muted-foreground">{fb.email}</span>
                                          <span className="text-xs text-muted-foreground/50 ml-auto shrink-0">
                                            {new Date(fb.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                          </span>
                                        </div>
                                        <p className="text-sm text-foreground/80 mt-0.5">{fb.subject}</p>
                                        <p className="text-xs text-muted-foreground mt-1 truncate">{fb.message}</p>
                                      </div>
                                    </div>
                                  </button>
                                  <AnimatePresence>
                                    {expandedFeedback === fb.id && (
                                      <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="overflow-hidden"
                                      >
                                        <div className="px-4 pb-4 pt-0 ml-5">
                                          <div className="bg-secondary/50 rounded-lg p-4 border border-border/50">
                                            <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">{fb.message}</p>
                                          </div>
                                          <div className="flex items-center gap-2 mt-3">
                                            {!fb.read && (
                                              <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => markFeedbackRead(fb.id, true)}
                                                className="text-xs h-8"
                                              >
                                                <Check className="w-3 h-3 mr-1" />
                                                Marquer comme lu
                                              </Button>
                                            )}
                                            {fb.read && (
                                              <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => markFeedbackRead(fb.id, false)}
                                                className="text-xs h-8"
                                              >
                                                <MessageSquare className="w-3 h-3 mr-1" />
                                                Marquer comme non lu
                                              </Button>
                                            )}
                                            <Button
                                              variant="outline"
                                              size="sm"
                                              onClick={() => deleteFeedback(fb.id)}
                                              className="text-xs h-8 text-red-400 hover:text-red-300 hover:bg-red-500/10 border-red-500/20"
                                            >
                                              <Trash2 className="w-3 h-3 mr-1" />
                                              Supprimer
                                            </Button>
                                          </div>
                                        </div>
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </div>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}

                  {/* Chapters Tab */}
                  {adminTab === 'chapters' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="space-y-6">
                      {/* Add Chapter Form */}
                      <Card className="glass-card">
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Layers className="w-5 h-5 text-emerald-400" /> Ajouter un Chapitre
                          </CardTitle>
                          <CardDescription>Créez un nouveau chapitre de cours avec notebooks.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Titre *</Label>
                              <Input
                                value={adminNewChapter.title}
                                onChange={(e) => setAdminNewChapter(prev => ({ ...prev, title: e.target.value }))}
                                placeholder="Titre du chapitre"
                                className="glass-input"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Type</Label>
                              <Select value={adminNewChapter.type} onValueChange={(v) => setAdminNewChapter(prev => ({ ...prev, type: v }))}>
                                <SelectTrigger className="glass-input"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="chapter">Chapitre</SelectItem>
                                  <SelectItem value="annexe">Annexe</SelectItem>
                                  <SelectItem value="atelier">Atelier</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea
                              value={adminNewChapter.description}
                              onChange={(e) => setAdminNewChapter(prev => ({ ...prev, description: e.target.value }))}
                              placeholder="Description du chapitre..."
                              rows={3}
                              className="glass-input"
                            />
                          </div>
                          <div className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Ordre</Label>
                              <Input
                                type="number"
                                value={adminNewChapter.order}
                                onChange={(e) => setAdminNewChapter(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                                placeholder="0"
                                className="glass-input"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>ID Section (optionnel)</Label>
                              <Input
                                value={adminNewChapter.sectionId}
                                onChange={(e) => setAdminNewChapter(prev => ({ ...prev, sectionId: e.target.value }))}
                                placeholder="ex: regression"
                                className="glass-input"
                              />
                            </div>
                          </div>
                          <Button onClick={addChapter} className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
                            <Plus className="w-4 h-4 mr-2" /> Ajouter le chapitre
                          </Button>
                        </CardContent>
                      </Card>

                      {/* Existing Chapters List */}
                      <Card className="glass-card">
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-primary-foreground" /> Chapitres existants ({adminChapters.length})
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          {adminChapters.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                              <Layers className="w-10 h-10 mx-auto mb-2 opacity-50" />
                              <p className="text-sm">Aucun chapitre créé</p>
                            </div>
                          ) : (
                            <div className="space-y-4 max-h-96 overflow-y-auto">
                              {adminChapters.map((chapter) => (
                                <div key={chapter.id} className="p-4 rounded-lg bg-secondary/50 border border-border">
                                  <div className="flex items-start justify-between gap-3 mb-3">
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2 mb-1">
                                        <h4 className="font-medium text-sm truncate">{chapter.title}</h4>
                                        <Badge variant="outline" className="text-[10px] shrink-0">{chapter.type}</Badge>
                                        <span className="text-[10px] text-muted-foreground shrink-0">#{chapter.order}</span>
                                      </div>
                                      {chapter.description && (
                                        <p className="text-xs text-muted-foreground line-clamp-2">{chapter.description}</p>
                                      )}
                                    </div>
                                    <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300 hover:bg-red-500/10 shrink-0" onClick={() => deleteChapter(chapter.id)}>
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                  {/* Chapter Notebooks */}
                                  {chapter.notebooks && chapter.notebooks.length > 0 && (
                                    <div className="space-y-2 mt-3 pt-3 border-t border-border">
                                      <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                                        <FileCode2 className="w-3 h-3" /> Notebooks ({chapter.notebooks.length})
                                      </h5>
                                      {chapter.notebooks.map((nb) => (
                                        <div key={nb.id} className="flex items-center gap-2 p-2 rounded bg-secondary/80 text-xs">
                                          <FileText className="w-3 h-3 text-amber-400 shrink-0" />
                                          <span className="flex-1 truncate">{nb.title || nb.fileName}</span>
                                          <span className="text-muted-foreground shrink-0">{(nb.fileSize / 1024).toFixed(1)} Ko</span>
                                          {nb.colabUrl && (
                                            <a href={nb.colabUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 shrink-0">
                                              <ExternalLink className="w-3 h-3" />
                                            </a>
                                          )}
                                          <Button variant="ghost" size="sm" className="h-5 w-5 p-0 text-red-400 hover:text-red-300 shrink-0" onClick={() => deleteChapterNotebook(nb.id)}>
                                            <Trash2 className="w-2.5 h-2.5" />
                                          </Button>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      {/* Upload Notebook to Chapter */}
                      <Card className="glass-card">
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Upload className="w-5 h-5 text-amber-400" /> Ajouter un Notebook à un Chapitre
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <Label>Chapitre *</Label>
                            <Select value={selectedChapterForNotebook} onValueChange={setSelectedChapterForNotebook}>
                              <SelectTrigger className="glass-input"><SelectValue placeholder="Sélectionner un chapitre" /></SelectTrigger>
                              <SelectContent>
                                {adminChapters.map((ch) => (
                                  <SelectItem key={ch.id} value={ch.id}>{ch.title}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Fichier Notebook (.ipynb, .py, .json) *</Label>
                            <Input
                              type="file"
                              accept=".ipynb,.py,.json"
                              onChange={(e) => setAdminChapterNotebookFile(e.target.files?.[0] || null)}
                              className="glass-input"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>URL Google Colab (optionnel)</Label>
                            <Input
                              value={adminChapterNotebookColabUrl}
                              onChange={(e) => setAdminChapterNotebookColabUrl(e.target.value)}
                              placeholder="https://colab.research.google.com/..."
                              className="glass-input"
                            />
                          </div>
                          <Button onClick={uploadChapterNotebook} disabled={adminChapterUploading || !adminChapterNotebookFile || !selectedChapterForNotebook} className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                            {adminChapterUploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                            {adminChapterUploading ? 'Envoi...' : 'Ajouter le Notebook'}
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}

                  {/* Settings Tab */}
                  {adminTab === 'settings' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
                      <Card className="glass-card">
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Mail className="w-5 h-5 text-purple-400" /> Notifications par Email
                          </CardTitle>
                          <CardDescription>Recevez un email à chaque modification de TP.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <Label>Email de notification</Label>
                            <Input value={adminSettings.notifyEmail} onChange={(e) => setAdminSettings(prev => ({ ...prev, notifyEmail: e.target.value }))} placeholder="votre@email.com" className="glass-input" />
                          </div>
                          <div className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Serveur SMTP</Label>
                              <Input value={adminSettings.smtpHost} onChange={(e) => setAdminSettings(prev => ({ ...prev, smtpHost: e.target.value }))} placeholder="smtp.gmail.com" className="glass-input" />
                            </div>
                            <div className="space-y-2">
                              <Label>Port SMTP</Label>
                              <Input type="number" value={adminSettings.smtpPort} onChange={(e) => setAdminSettings(prev => ({ ...prev, smtpPort: parseInt(e.target.value) || 587 }))} placeholder="587" className="glass-input" />
                            </div>
                          </div>
                          <div className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Utilisateur SMTP</Label>
                              <Input value={adminSettings.smtpUser} onChange={(e) => setAdminSettings(prev => ({ ...prev, smtpUser: e.target.value }))} placeholder="votre@email.com" className="glass-input" />
                            </div>
                            <div className="space-y-2">
                              <Label>Mot de passe SMTP</Label>
                              <Input type="password" value={adminSettings.smtpPass} onChange={(e) => setAdminSettings(prev => ({ ...prev, smtpPass: e.target.value }))} placeholder="••••••••" className="glass-input" />
                            </div>
                          </div>
                          <div className="space-y-3">
                            <Label>Types de notifications</Label>
                            <div className="flex flex-wrap gap-3">
                              {([
                                { key: 'notifyOnCreate', label: 'Création de TP' },
                                { key: 'notifyOnUpdate', label: 'Modification de TP' },
                                { key: 'notifyOnDelete', label: 'Suppression de TP' },
                              ] as const).map(item => (
                                <label key={item.key} className="flex items-center gap-2 cursor-pointer text-sm">
                                  <input
                                    type="checkbox"
                                    checked={adminSettings[item.key]}
                                    onChange={(e) => setAdminSettings(prev => ({ ...prev, [item.key]: e.target.checked }))}
                                    className="rounded"
                                  />
                                  {item.label}
                                </label>
                              ))}
                            </div>
                          </div>
                          <div className="flex gap-3 pt-2">
                            <Button onClick={saveAdminSettings} disabled={adminSettingsLoading} className="bg-gradient-to-r from-primary to-purple-500 text-white">
                              {adminSettingsLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                              {adminSettingsSaved ? 'Enregistré' : 'Enregistrer'}
                            </Button>
                            <Button variant="outline" onClick={sendTestEmail} disabled={testEmailLoading}>
                              {testEmailLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
                              Tester
                            </Button>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Theme Selector Card */}
                      <Card className="glass-card mt-6">
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Sun className="w-5 h-5 text-amber-400" /> Thème
                          </CardTitle>
                          <CardDescription>Choisissez l&apos;apparence de l&apos;interface.</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-3 gap-3">
                            {([
                              { mode: 'dark' as const, label: 'Sombre', icon: <Moon className="w-4 h-4" />, bgClass: 'bg-gray-900', borderClass: 'border-gray-700', textClass: 'text-gray-200' },
                              { mode: 'light' as const, label: 'Clair', icon: <Sun className="w-4 h-4" />, bgClass: 'bg-white', borderClass: 'border-gray-300', textClass: 'text-gray-800' },
                              { mode: 'system' as const, label: 'Système', icon: <Monitor className="w-4 h-4" />, bgClass: 'bg-gradient-to-r from-gray-900 to-white', borderClass: 'border-gray-500', textClass: 'text-foreground' },
                            ]).map(opt => (
                              <button
                                key={opt.mode}
                                onClick={() => handleThemeModeChange(opt.mode)}
                                className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                                  themeMode === opt.mode
                                    ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10'
                                    : 'border-border hover:border-primary/40 hover:bg-secondary/50'
                                }`}
                              >
                                <div className={`w-10 h-10 rounded-full ${opt.bgClass} border ${opt.borderClass} flex items-center justify-center shadow-inner`}>
                                  <span className={opt.mode === 'light' ? 'text-gray-700' : opt.mode === 'dark' ? 'text-gray-200' : ''}>
                                    {opt.icon}
                                  </span>
                                </div>
                                <span className={`text-sm font-medium ${themeMode === opt.mode ? 'text-primary' : 'text-muted-foreground'}`}>
                                  {opt.label}
                                </span>
                                {themeMode === opt.mode && (
                                  <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                                    <Check className="w-3 h-3 text-primary-foreground" />
                                  </div>
                                )}
                              </button>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ─── Command Palette (Ctrl+K) ─────────────────────────── */}
      {commandPaletteOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => { setCommandPaletteOpen(false); setCommandSearch(''); setSelectedCommandIndex(0); }} />
          {/* Panel */}
          <div className="relative w-full max-w-lg mx-4 bg-card border border-border rounded-xl shadow-2xl overflow-hidden">
            <div className="flex items-center border-b border-border px-4">
              <Search className="w-4 h-4 text-muted-foreground mr-2 shrink-0" />
              <input
                ref={commandInputRef}
                value={commandSearch}
                onChange={(e) => setCommandSearch(e.target.value)}
                onKeyDown={handleCommandKeyDown}
                placeholder="Rechercher une action, un cours, une page..."
                className="flex-1 bg-transparent py-3.5 text-sm outline-none placeholder:text-muted-foreground"
                autoFocus
              />
              <kbd className="hidden sm:inline-flex items-center gap-1 rounded border border-border bg-secondary px-1.5 py-0.5 text-[10px] text-muted-foreground font-mono">
                ESC
              </kbd>
            </div>
            <div className="max-h-80 overflow-y-auto p-2">
              {filteredCommands.length === 0 ? (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  Aucun résultat trouvé pour &quot;{commandSearch}&quot;
                </div>
              ) : (
                <div className="space-y-0.5">
                  {/* Navigation group */}
                  {filteredCommands.filter((c) => c.type === 'nav').length > 0 && (
                    <>
                      <div className="px-2 py-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Navigation</div>
                      {filteredCommands.filter((c) => c.type === 'nav').map((item, i) => {
                        const globalIdx = filteredCommands.indexOf(item);
                        return (
                          <button
                            key={`nav-${item.label}`}
                            className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-md text-sm transition-colors text-left ${
                              globalIdx === selectedCommandIndex
                                ? 'bg-primary/10 text-foreground'
                                : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                            }`}
                            onClick={() => executeCommand(item.action)}
                            onMouseEnter={() => setSelectedCommandIndex(globalIdx)}
                          >
                            <span className="text-primary-foreground">{item.icon}</span>
                            <span className="flex-1 font-medium">{item.label}</span>
                            <span className="text-xs text-muted-foreground">{item.description}</span>
                          </button>
                        );
                      })}
                    </>
                  )}
                  {/* Chapters group */}
                  {filteredCommands.filter((c) => c.type === 'chapter').length > 0 && (
                    <>
                      <div className="px-2 py-1.5 mt-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Chapitres</div>
                      {filteredCommands.filter((c) => c.type === 'chapter').map((item) => {
                        const globalIdx = filteredCommands.indexOf(item);
                        return (
                          <button
                            key={`chapter-${(item as { sectionId: string }).sectionId}`}
                            className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-md text-sm transition-colors text-left ${
                              globalIdx === selectedCommandIndex
                                ? 'bg-primary/10 text-foreground'
                                : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                            }`}
                            onClick={() => executeCommand(item.action)}
                            onMouseEnter={() => setSelectedCommandIndex(globalIdx)}
                          >
                            <span className="text-primary-foreground">{item.icon}</span>
                            <span className="flex-1 font-medium">{item.label}</span>
                            <span className="text-xs text-muted-foreground">{item.description}</span>
                          </button>
                        );
                      })}
                    </>
                  )}
                  {/* Actions group */}
                  {filteredCommands.filter((c) => c.type === 'action').length > 0 && (
                    <>
                      <div className="px-2 py-1.5 mt-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Actions</div>
                      {filteredCommands.filter((c) => c.type === 'action').map((item) => {
                        const globalIdx = filteredCommands.indexOf(item);
                        return (
                          <button
                            key={`action-${item.label}`}
                            className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-md text-sm transition-colors text-left ${
                              globalIdx === selectedCommandIndex
                                ? 'bg-primary/10 text-foreground'
                                : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                            }`}
                            onClick={() => executeCommand(item.action)}
                            onMouseEnter={() => setSelectedCommandIndex(globalIdx)}
                          >
                            <span className="text-amber-400">{item.icon}</span>
                            <span className="flex-1 font-medium">{item.label}</span>
                            <span className="text-xs text-muted-foreground">{item.description}</span>
                          </button>
                        );
                      })}
                    </>
                  )}
                </div>
              )}
            </div>
            <div className="border-t border-border px-4 py-2 flex items-center gap-3 text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1"><kbd className="shortcut-key">↑</kbd><kbd className="shortcut-key">↓</kbd> Naviguer</span>
              <span className="flex items-center gap-1"><kbd className="shortcut-key">↵</kbd> Sélectionner</span>
              <span className="flex items-center gap-1"><kbd className="shortcut-key">ESC</kbd> Fermer</span>
            </div>
          </div>
        </div>
      )}

      {/* ─── Study Timer Floating Widget ─────────────────────── */}
      <AnimatePresence>
        {showStudyTimer && (
          <motion.div
            initial={{ opacity: 0, x: -20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -20, scale: 0.9 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-6 left-6 z-50"
          >
            <div className="glass-card study-timer-widget rounded-2xl p-4 shadow-xl border border-border/50 w-56 card-inner-glow">
              {/* Mode indicator */}
              <div className="flex items-center justify-between mb-3">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                  studyTimer.mode === 'focus'
                    ? 'bg-primary/20 text-primary-foreground'
                    : 'bg-emerald-500/20 text-emerald-400'
                }`}>
                  {studyTimer.mode === 'focus' ? 'Focus' : 'Pause'}
                </span>
                <button
                  onClick={() => setShowStudyTimer(false)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Fermer le minuteur"
                >
                  <XCircle className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Circular progress ring */}
              <div className="flex justify-center mb-3">
                <div className="relative w-28 h-28">
                  <svg className="w-28 h-28 -rotate-90" viewBox="0 0 120 120">
                    {/* Background circle */}
                    <circle
                      cx="60" cy="60" r="52"
                      fill="none"
                      stroke="currentColor"
                      className="text-secondary"
                      strokeWidth="6"
                    />
                    {/* Progress circle */}
                    <circle
                      cx="60" cy="60" r="52"
                      fill="none"
                      className={studyTimer.mode === 'focus' ? 'text-primary' : 'text-emerald-500'}
                      stroke="currentColor"
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 52}`}
                      strokeDashoffset={`${2 * Math.PI * 52 * (1 - studyTimer.seconds / (studyTimer.mode === 'focus' ? studyTimer.focusDuration : studyTimer.breakDuration))}`}
                      style={{ transition: 'stroke-dashoffset 1s linear' }}
                    />
                  </svg>
                  {/* Timer text */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold tabular-nums">
                      {Math.floor(studyTimer.seconds / 60).toString().padStart(2, '0')}:{(studyTimer.seconds % 60).toString().padStart(2, '0')}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {studyTimer.mode === 'focus' ? `${studyTimer.focusDuration / 60} min` : `${studyTimer.breakDuration / 60} min`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => setStudyTimer(prev => ({ ...prev, isRunning: !prev.isRunning }))}
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                    studyTimer.isRunning
                      ? 'bg-secondary hover:bg-secondary/80 text-foreground'
                      : studyTimer.mode === 'focus'
                        ? 'bg-primary text-white hover:bg-primary/90'
                        : 'bg-emerald-500 text-white hover:bg-emerald-500/90'
                  }`}
                  aria-label={studyTimer.isRunning ? 'Pause' : 'Démarrer'}
                >
                  {studyTimer.isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                </button>
                <button
                  onClick={() => setStudyTimer(prev => ({ ...prev, seconds: prev.mode === 'focus' ? prev.focusDuration : prev.breakDuration, isRunning: false }))}
                  className="w-9 h-9 rounded-full bg-secondary hover:bg-secondary/80 flex items-center justify-center text-muted-foreground hover:text-foreground transition-all"
                  aria-label="Réinitialiser"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    const isFocusToBreak = studyTimer.mode === 'focus';
                    setStudyTimer(prev => ({
                      ...prev,
                      mode: isFocusToBreak ? 'break' : 'focus',
                      seconds: isFocusToBreak ? prev.breakDuration : prev.focusDuration,
                      isRunning: false,
                    }));
                  }}
                  className="w-9 h-9 rounded-full bg-secondary hover:bg-secondary/80 flex items-center justify-center text-muted-foreground hover:text-foreground transition-all"
                  aria-label="Passer"
                >
                  <SkipForward className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Keyboard Shortcuts Overlay ──────────────────────── */}
      <AnimatePresence>
        {showShortcuts && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] flex items-center justify-center"
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowShortcuts(false)} />
            {/* Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-md mx-4 bg-card border border-border rounded-xl shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                <h2 className="text-sm font-bold flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-primary-foreground" />
                  Raccourcis Clavier
                </h2>
                <button
                  onClick={() => setShowShortcuts(false)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Fermer"
                >
                  <XCircle className="w-4 h-4" />
                </button>
              </div>
              <div className="px-5 py-4 space-y-3">
                {[
                  { keys: '⌘K / Ctrl+K', action: 'Ouvrir la palette de commandes' },
                  { keys: '?', action: 'Raccourcis clavier' },
                  { keys: '1', action: 'Onglet Accueil' },
                  { keys: '2', action: 'Onglet Cours' },
                  { keys: '3', action: 'Onglet TPs' },
                  { keys: '4', action: 'Onglet Contact' },
                  { keys: '5', action: 'Onglet Administration' },
                  { keys: 'Echap', action: 'Fermer les boîtes de dialogue' },
                ].map((shortcut) => (
                  <div key={shortcut.keys} className="flex items-center justify-between py-1.5">
                    <span className="text-sm text-muted-foreground">{shortcut.action}</span>
                    <kbd className="flex items-center gap-1 rounded-md border border-border bg-secondary px-2.5 py-1 text-xs font-mono text-foreground min-w-[100px] justify-end">
                      {shortcut.keys}
                    </kbd>
                  </div>
                ))}
              </div>
              <div className="border-t border-border px-5 py-3 text-center">
                <p className="text-[11px] text-muted-foreground">
                  Appuyez sur <kbd className="rounded border border-border bg-secondary px-1.5 py-0.5 text-[10px] font-mono mx-0.5">?</kbd> n&apos;importe quand pour ouvrir ce panneau
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Quick Notes Floating Widget ──────────────────────── */}
      <Sheet open={quickNotesSheetOpen} onOpenChange={setQuickNotesSheetOpen}>
        <SheetTrigger asChild>
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="fixed bottom-20 right-6 z-50 w-11 h-11 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center"
            aria-label="Notes rapides"
          >
            <StickyNote className="w-5 h-5" />
            {quickNotes.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-amber-400 border-2 border-background animate-pulse" />
            )}
          </motion.button>
        </SheetTrigger>
        <SheetContent side="right" className="w-full sm:w-96 p-0 overflow-hidden">
          <SheetHeader className="px-6 pt-6 pb-3 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                <StickyNote className="w-4 h-4 text-white" />
              </div>
              <div>
                <SheetTitle className="text-base">Notes Rapides</SheetTitle>
                <p className="text-xs text-muted-foreground mt-0.5">Sauvegarde automatique</p>
              </div>
            </div>
          </SheetHeader>
          <div className="px-6 py-4 flex-1 flex flex-col gap-3">
            <Textarea
              value={quickNotes}
              onChange={(e) => handleQuickNotesChange(e.target.value)}
              placeholder="Prenez des notes ici..."
              className="min-h-[240px] resize-y bg-secondary/30 border-border focus:ring-primary/30 text-sm leading-relaxed"
              aria-label="Zone de notes"
            />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="tabular-nums">{quickNotes.length} caractères</span>
                {quickNotesSaving && (
                  <span className="flex items-center gap-1 text-amber-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                    Sauvegarde...
                  </span>
                )}
                {!quickNotesSaving && quickNotesLastSave && (
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Dernière sauvegarde : {quickNotesLastSave}
                  </span>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearQuickNotes}
                disabled={quickNotes.length === 0}
                className="text-xs text-muted-foreground hover:text-destructive h-8 px-2"
              >
                <Trash2 className="w-3.5 h-3.5 mr-1" />
                Effacer
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* ─── Back to Top Button ─────────────────────────────── */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-6 right-6 z-50 w-11 h-11 rounded-full bg-gradient-to-br from-primary to-purple-500 text-white shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200 flex items-center justify-center btn-icon-float"
            aria-label="Retour en haut"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* ─── Mobile Bottom Navigation Bar ────────────────────── */}
      {!showOnboarding && (
        <nav
          className="fixed bottom-0 left-0 right-0 z-[60] md:hidden bg-card/80 backdrop-blur-lg border-t border-border/50 pb-safe"
          aria-label="Navigation mobile"
        >
          <div className="flex items-center justify-around h-16 px-2">
            {[
              { id: 'accueil' as TabId, label: 'Accueil', icon: Brain },
              { id: 'cours' as TabId, label: 'Cours', icon: BookOpen },
              { id: 'tps' as TabId, label: 'TPs', icon: Code2 },
              { id: 'contact' as TabId, label: 'Contact', icon: Send },
              { id: 'admin' as TabId, label: 'Admin', icon: Shield },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => switchTab(tab.id)}
                  className={`flex flex-col items-center justify-center gap-1 w-full h-full transition-colors rounded-lg ${
                    isActive
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                  aria-label={tab.label}
                >
                  <span className="relative">
                    <Icon className={`w-5 h-5 transition-all ${isActive ? 'scale-110' : ''}`} />
                    {tab.id === 'admin' && adminFeedbacks.filter(f => !f.read).length > 0 && (
                      <span className="notification-dot" />
                    )}
                  </span>
                  <span className="text-[10px] font-medium">{tab.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="mobile-nav-indicator"
                      className="absolute -bottom-0 w-8 h-0.5 bg-primary rounded-full"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </nav>
      )}

      {/* ─── Footer ──────────────────────────────────────────── */}
      <footer className="border-t border-border/50 bg-card/50 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8 relative">
            {/* Brand Column */}
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-lg gradient-text">IA Academy</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                Plateforme de formation en Machine Learning et Deep Learning. Cours interactifs, travaux pratiques et projets concrets.
              </p>
              <div className="flex items-center gap-3">
                <a href="mailto:imadmaalouf02@gmail.com" className="w-9 h-9 rounded-lg bg-secondary/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors" aria-label="Email">
                  <Mail className="w-4 h-4" />
                </a>
                <a href="https://github.com/imadmaalouf02" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-secondary/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors" aria-label="GitHub">
                  <Github className="w-4 h-4" />
                </a>
                <a href="https://huggingface.co/MAALOUFimad02" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-secondary/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors" aria-label="HuggingFace">
                  <Zap className="w-4 h-4" />
                </a>
              </div>
            </div>

            <div className="gradient-line-v indigo h-full w-px hidden lg:block absolute left-[25%] top-0 bottom-0" />
            {/* Quick Links */}
            <div>
              <h3 className="font-semibold text-sm mb-4">Navigation</h3>
              <ul className="space-y-2.5">
                {[
                  { label: 'Accueil', tab: 'accueil' as TabId },
                  { label: 'Cours', tab: 'cours' as TabId },
                  { label: 'Travaux Pratiques', tab: 'tps' as TabId },
                  { label: 'Contact', tab: 'contact' as TabId },
                ].map((link) => (
                  <li key={link.tab}>
                    <button
                      onClick={() => switchTab(link.tab)}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors hover-underline-animated"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="gradient-line-v indigo h-full w-px hidden lg:block absolute left-[50%] top-0 bottom-0" />
            {/* Resources */}
            <div>
              <h3 className="font-semibold text-sm mb-4">Ressources</h3>
              <ul className="space-y-2.5">
                {[
                  { label: 'Scikit-learn', url: 'https://scikit-learn.org' },
                  { label: 'TensorFlow', url: 'https://tensorflow.org' },
                  { label: 'PyTorch', url: 'https://pytorch.org' },
                  { label: 'Google Colab', url: 'https://colab.research.google.com' },
                  { label: 'Kaggle', url: 'https://kaggle.com' },
                ].map((link) => (
                  <li key={link.label}>
                    <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1 hover-underline-animated">
                      {link.label}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="gradient-line-v indigo h-full w-px hidden lg:block absolute left-[75%] top-0 bottom-0" />
            {/* Info */}
            <div>
              <h3 className="font-semibold text-sm mb-4">Informations</h3>
              <ul className="space-y-2.5">
                <li className="flex items-center gap-2 text-sm text-muted-foreground">
                  <GraduationCap className="w-4 h-4 text-primary-foreground/60" />
                  Formation IA Machine Learning
                </li>
                <li className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4 text-primary-foreground/60" />
                  2025/2026
                </li>
                <li className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="w-4 h-4 text-primary-foreground/60" />
                  Par MAALOUF Imad & AJEBLI Ahmed
                </li>
                <li className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="w-4 h-4 text-primary-foreground/60" />
                  <a href="mailto:imadmaalouf02@gmail.com" className="hover:text-foreground transition-colors">imadmaalouf02@gmail.com</a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-border/50 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} IA Academy. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
