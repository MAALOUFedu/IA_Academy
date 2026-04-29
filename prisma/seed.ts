import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Check if TPs already exist
  const existingTps = await prisma.tP.count();
  if (existingTps > 0) {
    console.log(`✅ Database already has ${existingTps} TPs. Skipping seed.`);
    return;
  }

  // Delete all existing TPs (clean slate)
  await prisma.tP.deleteMany();

  const seedData = [
    {
      title: "TP 1 : Titanic Survival Prediction",
      description:
        "Prédire la survie des passagers du Titanic en utilisant des algorithmes de classification binaire. Ce TP classique de Machine Learning vous permettra d'explorer l'analyse exploratoire des données, le feature engineering et la comparaison de plusieurs modèles de classification.",
      category: "Classification",
      difficulty: "Débutant",
      duration: "45 min",
      color: "#1e40af",
      kaggleUrl: "https://www.kaggle.com/c/titanic",
      datasetName: "Titanic",
      datasetRows: "891",
      datasetCols: "12",
      objective:
        "Construire un modèle de classification binaire capable de prédire si un passager du Titanic a survécu ou non, en se basant sur ses caractéristiques personnelles telles que l'âge, le sexe, la classe de billet, etc.",
      expectedResult:
        "Un modèle avec une accuracy supérieure à 78% sur le jeu de test, une courbe ROC-AUC > 0.80, et une analyse des features les plus importantes pour la prédiction de survie.",
      steps: JSON.stringify([
        "Chargement et exploration du dataset Titanic",
        "Analyse exploratoire des données (EDA)",
        "Visualisation des distributions et corrélations",
        "Traitement des valeurs manquantes (Age, Cabin, Embarked)",
        "Feature Engineering (titres, familles, classes de tickets)",
        "Encodage des variables catégorielles",
        "Division train/test du dataset",
        "Entraînement de plusieurs modèles (Logistic Regression, Random Forest, SVM)",
        "Optimisation des hyperparamètres avec GridSearchCV",
        "Évaluation des performances et comparaison des modèles",
        "Analyse de l'importance des features",
        "Génération du fichier de soumission Kaggle",
      ]),
      concepts: JSON.stringify([
        "Classification binaire",
        "Analyse Exploratoire de Données (EDA)",
        "Feature Engineering",
        "Imputation de valeurs manquantes",
        "One-Hot Encoding",
        "Logistic Regression",
        "Random Forest",
        "Support Vector Machine (SVM)",
        "Cross-validation",
        "ROC Curve & AUC Score",
        "Matrice de confusion",
        "Feature Importance",
      ]),
      tags: JSON.stringify([
        "Classification", "Kaggle", "Feature Engineering", "EDA",
        "Binary Classification", "Python", "Scikit-learn", "Pandas", "Beginner",
      ]),
      order: 1,
    },
    {
      title: "TP 2 : House Prices Prediction",
      description:
        "Prédire les prix des maisons à Ames, Iowa en utilisant des techniques avancées de régression. Ce TP vous confronte à un dataset riche avec 81 features, vous apprenant la sélection de variables, la gestion de données manquantes complexes et les techniques de stacking.",
      category: "Régression",
      difficulty: "Intermédiaire",
      duration: "90 min",
      color: "#047857",
      kaggleUrl: "https://www.kaggle.com/c/house-prices-advanced-regression-techniques",
      datasetName: "House Prices",
      datasetRows: "1460",
      datasetCols: "81",
      objective:
        "Développer un modèle de régression performant pour prédire le prix de vente final de chaque maison, en maîtrisant les techniques de feature engineering avancées et la régularisation pour éviter le surapprentissage.",
      expectedResult:
        "Un modèle avec un RMSE < 0.12 (en log scale) sur le leaderboard Kaggle, des résidus normalement distribués, et un ranking dans le top 25% de la compétition.",
      steps: JSON.stringify([
        "Chargement du dataset Ames Housing",
        "Analyse de la distribution des prix de vente",
        "Transformation logarithmique de la variable cible",
        "Analyse des corrélations entre features",
        "Identification et traitement des outliers",
        "Imputation avancée des valeurs manquantes",
        "Feature Engineering (surface totale, qualité combinée, âge de la maison)",
        "Encoding des variables catégorielles (Ordinal et One-Hot)",
        "Sélection de features avec Lasso/Ridge",
        "Entraînement de modèles de régression (Ridge, Lasso, ElasticNet, XGBoost)",
        "Cross-validation K-Fold et stacking de modèles",
        "Soumission des prédictions sur Kaggle",
      ]),
      concepts: JSON.stringify([
        "Régression linéaire",
        "Ridge Regression (L2)",
        "Lasso Regression (L1)",
        "ElasticNet",
        "Gradient Boosting (XGBoost)",
        "Feature Engineering avancé",
        "Transformation log",
        "Outlier detection",
        "Cross-validation K-Fold",
        "Model Stacking",
        "Regularization",
        "RMSE & R² Score",
      ]),
      tags: JSON.stringify([
        "Regression", "Kaggle", "Feature Engineering", "Regularization",
        "XGBoost", "Python", "Advanced", "Housing",
      ]),
      order: 2,
    },
    {
      title: "TP 3 : Iris Classification",
      description:
        "Classifier les fleurs d'iris en 3 espèces (Setosa, Versicolor, Virginica) à partir de leurs mesures sépales et pétales. Un TP fondamental pour comprendre les bases de la classification multiclasse et la visualisation de données.",
      category: "Classification",
      difficulty: "Débutant",
      duration: "30 min",
      color: "#b45309",
      kaggleUrl: "https://www.kaggle.com/datasets/uciml/iris",
      datasetName: "Iris",
      datasetRows: "150",
      datasetCols: "5",
      objective:
        "Réaliser une classification multiclasse des fleurs d'iris en utilisant différentes mesures morphologiques, et comprendre les frontières de décision de plusieurs algorithmes.",
      expectedResult:
        "Un modèle avec une accuracy de 100% sur le test set, des visualisations claires des frontières de décision, et une compréhension des différences entre les algorithmes KNN, SVM et Decision Tree.",
      steps: JSON.stringify([
        "Chargement du dataset Iris",
        "Exploration des statistiques descriptives",
        "Visualisation des données avec pair plots",
        "Analyse en composantes principales (PCA)",
        "Normalisation des features",
        "Division train/test du dataset",
        "Entraînement de K-Nearest Neighbors (KNN)",
        "Entraînement de Support Vector Machine (SVM)",
        "Entraînement de Decision Tree",
        "Comparaison des performances des modèles",
        "Visualisation des frontières de décision",
        "Analyse des erreurs de classification",
      ]),
      concepts: JSON.stringify([
        "Classification multiclasse",
        "K-Nearest Neighbors (KNN)",
        "Support Vector Machine (SVM)",
        "Decision Tree",
        "Analyse en Composantes Principales (PCA)",
        "StandardScaler / Normalisation",
        "Pair plots & Visualisation",
        "Frontières de décision",
        "Matrice de confusion multiclasse",
        "Classification Report",
        "Cross-validation",
        "Overfitting vs Underfitting",
      ]),
      tags: JSON.stringify([
        "Classification", "Multiclass", "KNN", "SVM", "PCA",
        "Python", "Scikit-learn", "Beginner", "Visualization",
      ]),
      order: 3,
    },
    {
      title: "TP 4 : LSTM Time Series Forecasting",
      description:
        "Utiliser des réseaux de neurones récurrents (LSTM) pour prédire la consommation énergétique de bâtiments. Ce TP avancé aborde le traitement de séries temporelles à grande échelle avec le dataset ASHRAE contenant plus de 20 millions de lignes.",
      category: "Séries Temporelles",
      difficulty: "Avancé",
      duration: "120 min",
      color: "#7c3aed",
      kaggleUrl: "https://www.kaggle.com/c/ashrae-energy-prediction",
      datasetName: "ASHRAE Energy",
      datasetRows: "20M+",
      datasetCols: "1449 buildings",
      objective:
        "Construire un modèle LSTM capable de prédire la consommation énergétique horaire de bâtiments en se basant sur les données météorologiques et les caractéristiques des bâtiments, en gérant les défis des séries temporelles à grande échelle.",
      expectedResult:
        "Un modèle LSTM avec une erreur RMSLE < 1.0 sur le jeu de validation, des prédictions capturent correctement les tendances journalières et saisonnières, et une comparaison avec des modèles de base (ARIMA, Prophet).",
      steps: JSON.stringify([
        "Chargement et fusion des datasets (météo, bâtiments, consommation)",
        "Exploration des données de séries temporelles",
        "Analyse des tendances journalières et saisonnières",
        "Nettoyage des anomalies et valeurs aberrantes",
        "Feature Engineering temporel (heure, jour, mois, jour de la semaine)",
        "Création de séquences glissantes pour le LSTM",
        "Division en ensembles d'entraînement et de validation temporels",
        "Normalisation des données avec MinMaxScaler",
        "Construction de l'architecture LSTM (empilement de couches)",
        "Entraînement du modèle avec early stopping",
        "Évaluation et visualisation des prédictions vs réalité",
        "Comparaison avec ARIMA et Prophet comme baseline",
      ]),
      concepts: JSON.stringify([
        "Réseaux de neurones récurrents (RNN)",
        "Long Short-Term Memory (LSTM)",
        "Séries temporelles",
        "Windowing / Séquences glissantes",
        "Feature Engineering temporel",
        "MinMaxScaler",
        "Early Stopping",
        "Vanishing Gradient Problem",
        "ARIMA",
        "Prophet (Facebook)",
        "RMSLE (Root Mean Squared Logarithmic Error)",
        "Time-based Cross-Validation",
      ]),
      tags: JSON.stringify([
        "Time Series", "LSTM", "Deep Learning", "Neural Networks",
        "Energy", "Forecasting", "Kaggle", "Advanced", "TensorFlow", "Keras",
      ]),
      order: 4,
    },
  ];

  const created = await prisma.tP.createMany({
    data: seedData,
  });

  console.log(`✅ Successfully seeded ${created.count} TPs`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
