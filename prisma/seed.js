const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Check if TPs already exist
  const existingTps = await prisma.tP.count();
  if (existingTps > 0) {
    console.log("Database already has " + existingTps + " TPs. Skipping seed.");
    return;
  }

  // Delete all existing TPs (clean slate)
  await prisma.tP.deleteMany();

  const seedData = [
    {
      title: "TP 1 : Titanic Survival Prediction",
      description:
        "Predire la survie des passagers du Titanic en utilisant des algorithmes de classification binaire. Ce TP classique de Machine Learning vous permettra d'explorer l'analyse exploratoire des donnees, le feature engineering et la comparaison de plusieurs modeles de classification.",
      category: "Classification",
      difficulty: "Debutant",
      duration: "45 min",
      color: "#1e40af",
      kaggleUrl: "https://www.kaggle.com/c/titanic",
      datasetName: "Titanic",
      datasetRows: "891",
      datasetCols: "12",
      objective:
        "Construire un modele de classification binaire capable de predire si un passager du Titanic a survecu ou non, en se basant sur ses caracteristiques personnelles telles que l'age, le sexe, la classe de billet, etc.",
      expectedResult:
        "Un modele avec une accuracy superieure a 78% sur le jeu de test, une courbe ROC-AUC > 0.80, et une analyse des features les plus importantes pour la prediction de survie.",
      steps: JSON.stringify([
        "Chargement et exploration du dataset Titanic",
        "Analyse exploratoire des donnees (EDA)",
        "Visualisation des distributions et correlations",
        "Traitement des valeurs manquantes (Age, Cabin, Embarked)",
        "Feature Engineering (titres, familles, classes de tickets)",
        "Encodage des variables categorielles",
        "Division train/test du dataset",
        "Entrainement de plusieurs modeles (Logistic Regression, Random Forest, SVM)",
        "Optimisation des hyperparametres avec GridSearchCV",
        "Evaluation des performances et comparaison des modeles",
        "Analyse de l'importance des features",
        "Generation du fichier de soumission Kaggle",
      ]),
      concepts: JSON.stringify([
        "Classification binaire",
        "Analyse Exploratoire de Donnees (EDA)",
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
        "Predire les prix des maisons a Ames, Iowa en utilisant des techniques avancees de regression. Ce TP vous confronte a un dataset riche avec 81 features, vous apprenant la selection de variables, la gestion de donnees manquantes complexes et les techniques de stacking.",
      category: "Regression",
      difficulty: "Intermediaire",
      duration: "90 min",
      color: "#047857",
      kaggleUrl: "https://www.kaggle.com/c/house-prices-advanced-regression-techniques",
      datasetName: "House Prices",
      datasetRows: "1460",
      datasetCols: "81",
      objective:
        "Developper un modele de regression performant pour predire le prix de vente final de chaque maison, en maitrisant les techniques de feature engineering avancees et la regularisation pour eviter le surapprentissage.",
      expectedResult:
        "Un modele avec un RMSE < 0.12 (en log scale) sur le leaderboard Kaggle, des residus normalement distribues, et un ranking dans le top 25% de la competition.",
      steps: JSON.stringify([
        "Chargement du dataset Ames Housing",
        "Analyse de la distribution des prix de vente",
        "Transformation logarithmique de la variable cible",
        "Analyse des correlations entre features",
        "Identification et traitement des outliers",
        "Imputation avancee des valeurs manquantes",
        "Feature Engineering (surface totale, qualite combinee, age de la maison)",
        "Encoding des variables categorielles (Ordinal et One-Hot)",
        "Selection de features avec Lasso/Ridge",
        "Entrainement de modeles de regression (Ridge, Lasso, ElasticNet, XGBoost)",
        "Cross-validation K-Fold et stacking de modeles",
        "Soumission des predictions sur Kaggle",
      ]),
      concepts: JSON.stringify([
        "Regression lineaire",
        "Ridge Regression (L2)",
        "Lasso Regression (L1)",
        "ElasticNet",
        "Gradient Boosting (XGBoost)",
        "Feature Engineering avance",
        "Transformation log",
        "Outlier detection",
        "Cross-validation K-Fold",
        "Model Stacking",
        "Regularization",
        "RMSE & R2 Score",
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
        "Classifier les fleurs d'iris en 3 especes (Setosa, Versicolor, Virginica) a partir de leurs mesures sepales et petales. Un TP fondamental pour comprendre les bases de la classification multiclasse et la visualisation de donnees.",
      category: "Classification",
      difficulty: "Debutant",
      duration: "30 min",
      color: "#b45309",
      kaggleUrl: "https://www.kaggle.com/datasets/uciml/iris",
      datasetName: "Iris",
      datasetRows: "150",
      datasetCols: "5",
      objective:
        "Realiser une classification multiclasse des fleurs d'iris en utilisant differentes mesures morphologiques, et comprendre les frontieres de decision de plusieurs algorithmes.",
      expectedResult:
        "Un modele avec une accuracy de 100% sur le test set, des visualisations claires des frontieres de decision, et une comprehension des differences entre les algorithmes KNN, SVM et Decision Tree.",
      steps: JSON.stringify([
        "Chargement du dataset Iris",
        "Exploration des statistiques descriptives",
        "Visualisation des donnees avec pair plots",
        "Analyse en composantes principales (PCA)",
        "Normalisation des features",
        "Division train/test du dataset",
        "Entrainement de K-Nearest Neighbors (KNN)",
        "Entrainement de Support Vector Machine (SVM)",
        "Entrainement de Decision Tree",
        "Comparaison des performances des modeles",
        "Visualisation des frontieres de decision",
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
        "Frontieres de decision",
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
        "Utiliser des reseaux de neurones recurrents (LSTM) pour predire la consommation energetique de batiments. Ce TP avance aborde le traitement de series temporelles a grande echelle avec le dataset ASHRAE contenant plus de 20 millions de lignes.",
      category: "Series Temporelles",
      difficulty: "Avance",
      duration: "120 min",
      color: "#7c3aed",
      kaggleUrl: "https://www.kaggle.com/c/ashrae-energy-prediction",
      datasetName: "ASHRAE Energy",
      datasetRows: "20M+",
      datasetCols: "1449 buildings",
      objective:
        "Construire un modele LSTM capable de predire la consommation energetique horaire de batiments en se basant sur les donnees meteorologiques et les caracteristiques des batiments, en gerant les defis des series temporelles a grande echelle.",
      expectedResult:
        "Un modele LSTM avec une erreur RMSLE < 1.0 sur le jeu de validation, des predictions capturent correctement les tendances journalieres et saisonnieres, et une comparaison avec des modeles de base (ARIMA, Prophet).",
      steps: JSON.stringify([
        "Chargement et fusion des datasets (meteo, batiments, consommation)",
        "Exploration des donnees de series temporelles",
        "Analyse des tendances journalieres et saisonnieres",
        "Nettoyage des anomalies et valeurs aberrantes",
        "Feature Engineering temporel (heure, jour, mois, jour de la semaine)",
        "Creation de sequences glissantes pour le LSTM",
        "Division en ensembles d'entrainement et de validation temporels",
        "Normalisation des donnees avec MinMaxScaler",
        "Construction de l'architecture LSTM (empilement de couches)",
        "Entrainement du modele avec early stopping",
        "Evaluation et visualisation des predictions vs realite",
        "Comparaison avec ARIMA et Prophet comme baseline",
      ]),
      concepts: JSON.stringify([
        "Reseaux de neurones recurrents (RNN)",
        "Long Short-Term Memory (LSTM)",
        "Series temporelles",
        "Windowing / Sequences glissantes",
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

  console.log("Successfully seeded " + created.count + " TPs");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
