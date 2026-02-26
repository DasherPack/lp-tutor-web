/**
 * Metadata SEO por idioma para títulos, descripciones y keywords.
 */
import type { Locale } from "@/lib/i18n";
import { LOCALE_TO_BCP47 } from "@/lib/routing";

/** Construye alternates.languages para hreflang con URLs por idioma */
export function buildHreflang(baseUrl: string, path: string): Record<string, string> {
  const locales: Locale[] = ["es", "en", "fr", "de", "ja", "zh"];
  const out: Record<string, string> = {};
  for (const loc of locales) {
    const url = path ? `${baseUrl}/${loc}/${path}` : `${baseUrl}/${loc}`;
    out[LOCALE_TO_BCP47[loc]] = url;
  }
  out["x-default"] = path ? `${baseUrl}/es/${path}` : `${baseUrl}/es`;
  return out;
}

type PageMeta = {
  title: string;
  description: string;
  keywords: string[];
  ogTitle?: string;
  ogDescription?: string;
};

type MetaByPage = Record<"home" | "simplex" | "graphical", PageMeta>;

export const seoMetadata: Record<Locale, MetaByPage> = {
  es: {
    home: {
      title: "Calculadora de Programación Lineal — Simplex y Método Gráfico paso a paso",
      description:
        "Calculadora online gratuita de programación lineal. Resuelve problemas de optimización con el método Simplex paso a paso y el método gráfico 2D. Región factible, vértices, tableau Big-M, pivoteo. Para estudiantes e ingeniería.",
      keywords: [
        "programación lineal",
        "calculadora programación lineal",
        "simplex paso a paso",
        "método simplex",
        "método gráfico",
        "región factible",
        "resolver programación lineal online",
      ],
    },
    simplex: {
      title: "Método Simplex tabular paso a paso | Calculadora online",
      description:
        "Resuelve programación lineal con el algoritmo Simplex tabular paso a paso: forma estándar, variables de holgura y artificiales (Big-M), tableau inicial, regla del coste reducido, test de razón mínima y pivoteo Gauss-Jordan. Visualiza cada iteración.",
      keywords: [
        "método simplex",
        "algoritmo simplex",
        "simplex tabular",
        "tableau simplex",
        "Big-M",
        "variables de holgura",
        "pivoteo",
        "coste reducido",
        "razón mínima",
      ],
    },
    graphical: {
      title: "Método gráfico 2D — Región factible y óptimo | Programación lineal",
      description:
        "Resuelve programación lineal con dos variables usando el método gráfico: semiplanos, región factible, vértices del polígono y punto óptimo. Visualiza restricciones y evalúa max/min en los vértices.",
      keywords: [
        "método gráfico",
        "programación lineal 2D",
        "región factible",
        "semiplanos",
        "vértices",
        "optimización gráfica",
      ],
    },
  },
  en: {
    home: {
      title: "Linear Programming Calculator — Simplex and Graphical Method Step by Step",
      description:
        "Free online linear programming calculator. Solve optimization problems with the step-by-step Simplex method and 2D graphical method. Feasible region, vertices, Big-M tableau, pivoting. For students and engineers.",
      keywords: [
        "linear programming",
        "linear programming calculator",
        "simplex method calculator",
        "simplex step by step",
        "graphical method",
        "feasible region",
        "LP solver online",
      ],
    },
    simplex: {
      title: "Simplex Method Step by Step | Online Calculator",
      description:
        "Solve linear programming with the tabular Simplex algorithm step by step: standard form, slack and artificial variables (Big-M), initial tableau, reduced cost rule, minimum ratio test and Gauss-Jordan pivoting. Visualize each iteration.",
      keywords: [
        "simplex method",
        "simplex algorithm",
        "simplex calculator",
        "simplex tableau",
        "Big-M",
        "slack variables",
        "pivoting",
        "reduced cost",
        "minimum ratio",
      ],
    },
    graphical: {
      title: "2D Graphical Method — Feasible Region and Optimum | Linear Programming",
      description:
        "Solve linear programming with two variables using the graphical method: half-planes, feasible region, polygon vertices and optimal point. Visualize constraints and evaluate max/min at vertices.",
      keywords: [
        "graphical method",
        "linear programming 2D",
        "feasible region",
        "half-planes",
        "vertices",
        "graphical optimization",
      ],
    },
  },
  fr: {
    home: {
      title: "Calculatrice Programmation Linéaire — Simplexe et Méthode Graphique",
      description:
        "Calculatrice en ligne gratuite de programmation linéaire. Résolvez les problèmes d'optimisation avec la méthode du Simplexe pas à pas et la méthode graphique 2D. Région réalisable, sommets, tableau Big-M.",
      keywords: [
        "programmation linéaire",
        "calculatrice programmation linéaire",
        "méthode du simplexe",
        "simplexe pas à pas",
        "méthode graphique",
        "région réalisable",
      ],
    },
    simplex: {
      title: "Méthode du Simplexe tabulaire pas à pas | Calculatrice en ligne",
      description:
        "Résolvez la programmation linéaire avec l'algorithme du Simplexe tabulaire pas à pas : forme standard, variables d'écart et artificielles (Big-M), tableau initial, règle du coût réduit, test du ratio minimal et pivotage Gauss-Jordan.",
      keywords: [
        "méthode du simplexe",
        "algorithme simplex",
        "simplexe tabulaire",
        "tableau simplex",
        "Big-M",
        "variables d'écart",
        "pivotage",
      ],
    },
    graphical: {
      title: "Méthode graphique 2D — Région réalisable et optimum",
      description:
        "Résolvez la programmation linéaire à deux variables avec la méthode graphique : demi-plans, région réalisable, sommets du polygone et point optimal. Visualisez les contraintes.",
      keywords: [
        "méthode graphique",
        "programmation linéaire 2D",
        "région réalisable",
        "sommets",
      ],
    },
  },
  de: {
    home: {
      title: "Lineare Programmierung Rechner — Simplex und Grafische Methode",
      description:
        "Kostenloser Online-Rechner für lineare Programmierung. Lösen Sie Optimierungsprobleme mit der Simplex-Methode Schritt für Schritt und der grafischen 2D-Methode. Zulässiger Bereich, Ecken, Big-M Tableau.",
      keywords: [
        "lineare Programmierung",
        "Lineare Optimierung",
        "Simplex Rechner",
        "Simplex-Methode",
        "grafische Methode",
        "zulässiger Bereich",
      ],
    },
    simplex: {
      title: "Simplex-Methode Schritt für Schritt | Online Rechner",
      description:
        "Lösen Sie lineare Programmierung mit dem tabellarischen Simplex-Algorithmus: Standardform, Schlupf- und künstliche Variablen (Big-M), reduzierter Kosten, Minimalquotientenregel und Pivotierung.",
      keywords: [
        "Simplex-Verfahren",
        "Simplex-Methode",
        "Simplex Rechner",
        "Simplex Tableau",
        "Big-M",
        "Schlupfvariablen",
      ],
    },
    graphical: {
      title: "2D-Grafikmethode — Zulässiger Bereich und Optimum",
      description:
        "Lösen Sie lineare Programmierung mit zwei Variablen mit der Grafikmethode: Halbebenen, zulässiger Bereich, Polygonecken und Optimalpunkt.",
      keywords: [
        "Grafikmethode",
        "lineare Programmierung 2D",
        "zulässiger Bereich",
        "Ecken",
      ],
    },
  },
  ja: {
    home: {
      title: "線形計画法計算機 — シンプレックス法・図解法ステップバイステップ",
      description:
        "無料オンライン線形計画法計算機。シンプレックス法と2次元図解法で最適化問題を解く。実行可能領域、頂点、Big-M tableau。学生・エンジニア向け。",
      keywords: [
        "線形計画法",
        "線形計画法 計算",
        "シンプレックス法",
        "シンプレックス法 計算機",
        "図解法",
        "実行可能領域",
      ],
    },
    simplex: {
      title: "シンプレックス法ステップバイステップ | オンライン計算機",
      description:
        "表形式シンプレックス法で線形計画法を解く：標準形、スラック変数・人工変数（Big-M）、縮小費用、最小比規則、ガウス・ジョルダンによるピボット。各反復を可視化。",
      keywords: [
        "シンプレックス法",
        "線形計画法",
        "シンプレックス 計算機",
        "tableau",
        "Big-M",
      ],
    },
    graphical: {
      title: "2次元図解法 — 実行可能領域と最適解",
      description:
        "2変数の線形計画問題を図解法で解く：半平面、実行可能領域、多角形の頂点、最適点。制約を可視化。",
      keywords: [
        "図解法",
        "線形計画法 2変数",
        "実行可能領域",
        "頂点",
      ],
    },
  },
  zh: {
    home: {
      title: "线性规划计算器 — 单纯形法与图解法逐步求解",
      description:
        "免费在线线性规划计算器。用单纯形法和二维图解法求解优化问题。可行域、顶点、大M法。适用于学生和工程师。",
      keywords: [
        "线性规划",
        "线性规划计算器",
        "单纯形法",
        "单纯形法计算器",
        "图解法",
        "可行域",
      ],
    },
    simplex: {
      title: "单纯形法步骤详解 | 在线计算器",
      description:
        "用表格式单纯形法求解线性规划：标准形、松弛变量与人工变量（大M法）、既约费用、最小比规则、高斯-若尔当主元消去。可视化每步迭代。",
      keywords: [
        "单纯形法",
        "线性规划",
        "单纯形法计算器",
        "单纯形表",
        "大M法",
      ],
    },
    graphical: {
      title: "二维图解法 — 可行域与最优点",
      description:
        "用图解法求解双变量线性规划：半平面、可行域、多边形顶点、最优点。可视化约束条件。",
      keywords: [
        "图解法",
        "线性规划 二维",
        "可行域",
        "顶点",
      ],
    },
  },
};
