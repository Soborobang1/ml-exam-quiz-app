// ML Final Exam Question Pool — 50 Questions
// Based on Sejong University Machine Learning (010000), Spring 2026
// Lectures 02-19 + Practice Notebooks
// Types: short | blank | ox | code-blank | code-explain

const QUESTIONS = [

  // =====================================================================
  // CATEGORY: Linear Regression  (Q1-Q5)
  // =====================================================================
  {
    id: 1,
    type: 'short',
    category: 'Linear Regression',
    source: { lecture: 'Lecture 2: Linear Regression and Least Squares', topic: 'Least Squares Minimization' },
    prompt: 'Describe what linear regression is, and explain the method used to find the optimal weight vector w. What does "least squares" mean in this context?',
    keywords: {
      required: ['least squares', 'minimize', 'squared error'],
      optional: ['linear combination', 'features', 'weight', 'closed form', 'continuous', 'prediction'],
      synonyms: {
        'minimize': ['minimizing', 'minimization', 'minimizes'],
        'squared error': ['sum of squared errors', 'sse', 'mean squared error', 'mse'],
        'linear combination': ['linear combination of features', 'linear function'],
      },
      minOptional: 2
    },
    modelAnswer: 'Linear regression predicts a continuous target value as a linear combination of input features (y = w^T x). The optimal weights w are found by least squares minimization, which minimizes the sum of squared errors between predictions and target values. When X^T X is invertible, the closed-form solution is w = (X^T X)^{-1} X^T t.',
    explanation: 'Linear regression uses a dot product of weights and features. Least squares means we minimize Σ(y_n - t_n)² over all training samples.',
  },

  {
    id: 2,
    type: 'blank',
    category: 'Linear Regression',
    source: { lecture: 'Lecture 3: Probabilistic View of Regression', topic: 'MLE = Least Squares' },
    prompt: 'Fill in the blanks about the probabilistic interpretation of linear regression.',
    text: 'Under the Gaussian noise assumption, maximizing the ___BLANK1___ of the model parameters is mathematically equivalent to ___BLANK2___ the sum of squared errors. This is because maximizing the log-likelihood removes a negative sign and constant terms, leaving a sum of ___BLANK3___ error terms.',
    blanks: [
      ['likelihood', 'log likelihood', 'log-likelihood'],
      ['minimizing', 'minimization', 'minimizes'],
      ['squared', 'squared error', 'squared prediction']
    ],
    modelAnswer: 'BLANK1: likelihood (log likelihood), BLANK2: minimizing, BLANK3: squared',
    explanation: 'Under Gaussian noise t = y(x,w) + ε where ε ~ N(0,σ²), the log-likelihood becomes: ln p = -N/2 ln(2πσ²) - (1/2σ²) Σ(t_n - y(x_n,w))². Maximizing this is equivalent to minimizing Σ(t_n - y_n)².',
    source_ref: 'Lecture 3, slide 18',
  },

  {
    id: 3,
    type: 'blank',
    category: 'Linear Regression',
    source: { lecture: 'Lecture 2: Linear Regression and Least Squares', topic: 'Overfitting vs. Underfitting' },
    prompt: 'Fill in the blanks about overfitting and underfitting.',
    text: 'Underfitting occurs when the model is too ___BLANK1___ to capture the underlying pattern, resulting in high ___BLANK2___ error and high test error. Overfitting occurs when the model learns the ___BLANK3___ in the training data, resulting in very low training error but high ___BLANK4___ error. Increasing the amount of ___BLANK5___ data is one way to alleviate overfitting.',
    blanks: [
      ['simple', 'simplistic', 'small'],
      ['training', 'train'],
      ['noise', 'random noise', 'accidental details'],
      ['test'],
      ['training', 'train']
    ],
    modelAnswer: 'BLANK1: simple, BLANK2: training, BLANK3: noise, BLANK4: test, BLANK5: training',
    explanation: 'Underfitting = too simple (high bias). Overfitting = too complex (high variance). Solutions: more data, regularization, or reducing model complexity.',
  },

  {
    id: 4,
    type: 'ox',
    category: 'Linear Regression',
    source: { lecture: 'Lecture 2 & 3: Linear Regression & Probabilistic View', topic: 'Core Concepts' },
    prompt: 'Determine whether each statement about linear regression and MLE is True or False.',
    subs: [
      {
        statement: 'Linear regression models the prediction as a linear combination of input features.',
        answer: true,
        explanation: 'Yes — linear regression predicts y = w^T x = w₀ + w₁x₁ + … + w_D x_D, which is exactly a linear combination of features.'
      },
      {
        statement: 'Maximizing the log-likelihood under the Gaussian noise assumption is equivalent to minimizing the sum of squared errors.',
        answer: true,
        explanation: 'Correct. Maximizing ln p(t|x,w,σ²) under Gaussian noise reduces to minimizing Σ(t_n − y_n)² after dropping constants and negating.'
      },
      {
        statement: 'The closed-form least-squares solution w* = (X^T X)^{-1} X^T t is always computable regardless of the dataset.',
        answer: false,
        explanation: 'False. The solution requires X^T X to be invertible (full column rank). If features are linearly dependent or there are more features than samples, X^T X is singular and the inverse does not exist.'
      },
      {
        statement: 'Overfitting occurs when the model is too simple to capture the underlying pattern.',
        answer: false,
        explanation: 'False. That describes underfitting. Overfitting occurs when the model is too complex and learns noise from the training data, leading to low training error but high test error.'
      },
      {
        statement: 'Increasing the amount of training data can help alleviate overfitting.',
        answer: true,
        explanation: 'Correct. More training data reduces overfitting because the model has more diverse examples to learn from, making it harder to memorize noise.'
      }
    ],
  },

  {
    id: 5,
    type: 'code-blank',
    category: 'Linear Regression',
    source: { lecture: 'Lecture 2 & Practice 4/5', topic: 'sklearn LinearRegression' },
    prompt: 'Fill in the blanks to complete a basic linear regression workflow using scikit-learn.',
    code: `from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error

model = LinearRegression()
model.___BLANK1___(X_train, y_train)   # Train the model on training data

y_pred = model.___BLANK2___(X_test)    # Generate predictions for test data
mse = mean_squared_error(y_test, y_pred)
print("Test MSE:", round(mse, 4))
print("Coefficients:", model.coef_)`,
    blanks: [
      ['fit'],
      ['predict']
    ],
    modelAnswer: 'BLANK1: fit, BLANK2: predict',
    explanation: 'In scikit-learn, all estimators use .fit(X, y) to train and .predict(X) to generate predictions. mean_squared_error computes (1/N)Σ(y_pred - y_true)².',
  },

  // =====================================================================
  // CATEGORY: Regularization  (Q6-Q10)
  // =====================================================================
  {
    id: 6,
    type: 'short',
    category: 'Regularization',
    source: { lecture: 'Lecture 4: Regularized Linear Regression', topic: 'Ridge vs. Lasso' },
    prompt: 'Explain the key differences between Ridge (L2) and Lasso (L1) regularization. How does each method affect the learned weight vector?',
    keywords: {
      required: ['ridge', 'lasso', 'zero', 'l2', 'l1'],
      optional: ['shrinkage', 'sparse', 'feature selection', 'penalty', 'smooth', 'coefficients', 'norm'],
      synonyms: {
        'ridge': ['ridge regularization', 'l2 regularization', 'weight decay'],
        'lasso': ['lasso regularization', 'l1 regularization'],
        'zero': ['exactly zero', 'set to zero', 'shrink to zero'],
        'sparse': ['sparsity', 'sparse solution'],
      },
      minOptional: 2
    },
    modelAnswer: 'Ridge (L2) regularization adds the sum of squared weights (L2 norm: Σwⱼ²) as a penalty. It shrinks all coefficients smoothly toward zero but keeps them non-zero. Lasso (L1) regularization adds the sum of absolute weights (L1 norm: Σ|wⱼ|) as a penalty. It can drive some coefficients to exactly zero, effectively performing feature selection and producing sparse models. When features are correlated, Ridge handles them better, while Lasso tends to pick one and ignore the rest.',
    explanation: 'The constraint region of L2 is a sphere (smooth, no corners), so the optimal point is rarely at zero. The L1 constraint region has corners, making it likely that some weights land exactly at zero.',
  },

  {
    id: 7,
    type: 'blank',
    category: 'Regularization',
    source: { lecture: 'Lecture 4 & 9', topic: 'L1, L2, Elastic Net' },
    prompt: 'Fill in the blanks about regularization methods.',
    text: 'Ridge regularization uses the ___BLANK1___ norm penalty and produces coefficients that are shrunk ___BLANK2___ toward zero (but remain non-zero). Lasso regularization uses the ___BLANK3___ norm penalty and can make some coefficients ___BLANK4___, performing feature selection. Elastic Net combines both Ridge and Lasso penalties, providing ___BLANK5___ and better handling of correlated features.',
    blanks: [
      ['L2', 'l2'],
      ['smoothly', 'proportionally'],
      ['L1', 'l1'],
      ['zero', 'exactly zero'],
      ['sparsity', 'sparse solutions', 'feature selection']
    ],
    modelAnswer: 'BLANK1: L2, BLANK2: smoothly, BLANK3: L1, BLANK4: zero, BLANK5: sparsity',
    explanation: 'Elastic Net: E_total = E_data + λ₁Σ|wⱼ| + λ₂Σwⱼ². It merges Lasso (L1) sparsity and Ridge (L2) handling of correlated features.',
  },

  {
    id: 8,
    type: 'short',
    category: 'Regularization',
    source: { lecture: 'Lecture 4: Regularized Linear Regression', topic: 'Feature Scaling & Regularization' },
    prompt: 'Explain why feature scaling is important when applying regularization to a linear regression model. What problem arises without it?',
    keywords: {
      required: ['scale', 'regularization', 'unfair', 'penalty'],
      optional: ['standardization', 'magnitude', 'large', 'small', 'weight', 'feature', 'different'],
      synonyms: {
        'scale': ['scaling', 'scaled', 'different scales', 'different ranges'],
        'unfair': ['unfairly', 'biased', 'unequal'],
        'penalty': ['penalized', 'penalizes', 'regularized'],
      },
      minOptional: 2
    },
    modelAnswer: 'Features with different scales need weights of very different magnitudes to produce the same effect on predictions. For example, annual income (values ~100,000) needs a very small weight while age (values ~10) needs a larger weight. Without scaling, regularization penalizes these weights differently regardless of their actual importance—this is unfair. Standardizing features ensures all weights are penalized equally by regularization.',
    explanation: 'Rule: always standardize features before applying Ridge, Lasso, or Elastic Net. Fit the scaler on the training set only and transform validation/test with the same parameters.',
  },

  {
    id: 9,
    type: 'ox',
    category: 'Regularization',
    source: { lecture: 'Lecture 4 & 9', topic: 'Regularization Concepts' },
    prompt: 'Determine whether each statement about regularization is True or False.',
    subs: [
      {
        statement: 'Ridge (L2) regularization can drive some weight coefficients to exactly zero.',
        answer: false,
        explanation: 'False. Ridge shrinks all coefficients smoothly toward zero but never makes them exactly zero. It is Lasso (L1) that can produce exactly zero coefficients.'
      },
      {
        statement: 'Lasso (L1) regularization tends to produce sparse weight vectors, making it useful for automatic feature selection.',
        answer: true,
        explanation: 'Correct. The L1 constraint region has corners, so the optimal solution often lands at a vertex where some coefficients are exactly zero, effectively selecting features.'
      },
      {
        statement: 'Elastic Net combines Ridge and Lasso penalties, providing sparsity and better handling of correlated features.',
        answer: true,
        explanation: 'Correct. Elastic Net: E = E_data + λ₁Σ|wⱼ| + λ₂Σwⱼ². Ridge handles correlated features well; Lasso provides sparsity; Elastic Net combines both benefits.'
      },
      {
        statement: 'The regularization coefficient λ (or α) is a model parameter that is learned automatically from the training data.',
        answer: false,
        explanation: 'False. λ (or α) is a hyperparameter, not a model parameter. It must be set before training and is typically selected using validation set performance or cross-validation.'
      },
      {
        statement: 'Without feature scaling, features with smaller numeric ranges may have their weights penalized more heavily than features with larger ranges, creating an unfair regularization effect.',
        answer: true,
        explanation: 'Correct. A feature with small values (e.g., age ~10) needs a large weight for the same effect as a feature with large values (e.g., income ~100,000). Regularization penalizes this large weight more heavily, which is unfair.'
      }
    ],
  },

  {
    id: 10,
    type: 'code-blank',
    category: 'Regularization',
    source: { lecture: 'Lecture 4 & Practice 6', topic: 'Ridge in Pipeline' },
    prompt: 'Fill in the blanks to build a Ridge regression pipeline with proper feature scaling.',
    code: `from sklearn.linear_model import Ridge
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import mean_squared_error

# Feature scaling is important before Ridge regularization
pipe = Pipeline([
    ('scaler', ___BLANK1___()),    # Standardize features
    ('ridge',  Ridge(alpha=1.0))
])

pipe.___BLANK2___(X_train, y_train)   # Train the pipeline

test_mse = mean_squared_error(y_test, pipe.predict(X_test))
print("Ridge Test MSE:", round(test_mse, 4))`,
    blanks: [
      ['StandardScaler'],
      ['fit']
    ],
    modelAnswer: 'BLANK1: StandardScaler, BLANK2: fit',
    explanation: 'Always wrap StandardScaler + Ridge in a Pipeline so the scaler is fit only on training data. Pipeline.fit() fits all steps in sequence.',
  },

  // =====================================================================
  // CATEGORY: Generalization & Bias-Variance  (Q11-Q13)
  // =====================================================================
  {
    id: 11,
    type: 'short',
    category: 'Generalization & Bias-Variance',
    source: { lecture: 'Lecture 5: Generalization and Model Complexity', topic: 'Bias-Variance Tradeoff' },
    prompt: 'Describe the bias-variance tradeoff. Define bias and variance individually, and explain how they relate to model complexity and overfitting/underfitting.',
    keywords: {
      required: ['bias', 'variance', 'model complexity', 'tradeoff'],
      optional: ['underfitting', 'overfitting', 'decrease', 'increase', 'simplifying assumptions', 'training data', 'average'],
      synonyms: {
        'bias': ['high bias', 'bias²'],
        'variance': ['high variance'],
        'model complexity': ['model capacity', 'complexity', 'capacity'],
        'tradeoff': ['trade-off', 'trade off'],
      },
      minOptional: 2
    },
    modelAnswer: 'Bias measures how far the average model prediction is from the true function — high when the model makes strong simplifying assumptions (e.g., linear model on nonlinear data). Variance measures how much the learned model changes when the training data changes — high when the model is too sensitive to training data fluctuations (e.g., a very deep tree). As model complexity increases, bias tends to decrease while variance tends to increase. Underfitting = high bias, low variance. Overfitting = low bias, high variance. Expected test error = Bias² + Variance + Noise.',
    explanation: 'The decomposition is: E[(y-t)²] = Bias² + Variance + σ². We cannot minimize both simultaneously — we must find the right complexity using a validation set.',
  },

  {
    id: 12,
    type: 'blank',
    category: 'Generalization & Bias-Variance',
    source: { lecture: 'Lecture 5: Generalization and Model Complexity', topic: 'Bias-Variance Behavior' },
    prompt: 'Fill in the blanks about how bias and variance change with model complexity.',
    text: 'As model capacity (complexity) increases, bias tends to ___BLANK1___ while variance tends to ___BLANK2___. A model with high bias suffers from ___BLANK3___, whereas a model with high variance suffers from ___BLANK4___. In practice, the best model complexity is chosen by minimizing the ___BLANK5___ error.',
    blanks: [
      ['decrease', 'decreases'],
      ['increase', 'increases'],
      ['underfitting', 'underfit'],
      ['overfitting', 'overfit'],
      ['validation']
    ],
    modelAnswer: 'BLANK1: decrease, BLANK2: increase, BLANK3: underfitting, BLANK4: overfitting, BLANK5: validation',
    explanation: 'Workflow: split data → train different models → choose best by validation error → retrain on train+val → report test error once.',
  },

  {
    id: 13,
    type: 'ox',
    category: 'Generalization & Bias-Variance',
    source: { lecture: 'Lecture 5: Generalization and Model Complexity', topic: 'Bias-Variance Concepts' },
    prompt: 'Determine whether each statement about the bias-variance tradeoff is True or False.',
    subs: [
      {
        statement: 'A model with high bias tends to overfit the training data.',
        answer: false,
        explanation: 'False. High bias causes underfitting — the model is too simple and fails to capture the pattern, producing high training error AND high test error.'
      },
      {
        statement: 'Increasing model complexity generally reduces bias but increases variance.',
        answer: true,
        explanation: 'Correct. More complex models (e.g., higher polynomial degree) can fit the training data more closely (lower bias) but become more sensitive to training data fluctuations (higher variance).'
      },
      {
        statement: 'The optimal model complexity is typically chosen by minimizing the validation error.',
        answer: true,
        explanation: 'Correct. We train multiple models with different complexities and select the one with the lowest validation error. The test set is used only once at the very end.'
      },
      {
        statement: 'A model with very high variance will have both high training error and high test error.',
        answer: false,
        explanation: 'False. High variance (overfitting) produces very LOW training error and HIGH test error — the model memorizes the training data well but generalizes poorly.'
      },
      {
        statement: 'The expected test error (expected loss) can be decomposed into squared bias, variance, and irreducible noise.',
        answer: true,
        explanation: 'Correct. E[(y-t)²] = Bias²(y) + Var(y) + σ². The noise term σ² is irreducible and cannot be reduced by any model.'
      }
    ],
  },

  // =====================================================================
  // CATEGORY: Feature Engineering  (Q14-Q17)
  // =====================================================================
  {
    id: 14,
    type: 'short',
    category: 'Feature Engineering',
    source: { lecture: 'Lecture 6: Feature Engineering', topic: 'Interaction Features & Polynomial Features' },
    prompt: 'What is an interaction feature? Give a concrete example and explain why it allows a linear model to capture relationships that otherwise would be missed.',
    keywords: {
      required: ['product', 'interaction', 'nonlinear'],
      optional: ['two features', 'combined effect', 'area', 'quality', 'polynomial', 'linear model', 'basis function'],
      synonyms: {
        'product': ['product of', 'multiply', 'multiplication'],
        'nonlinear': ['non-linear', 'nonlinear relationship'],
        'interaction': ['interaction feature', 'cross term'],
      },
      minOptional: 1
    },
    modelAnswer: 'An interaction feature is a new feature formed by multiplying (taking the product of) two or more existing features. Example: in house price prediction, the feature (area × quality) captures that a large area is only valuable if the quality is also high. This allows a linear regression model to learn nonlinear relationships: the effect of "area" on price now depends on "quality", something a purely additive linear model could not express without the interaction term.',
    explanation: 'Feature engineering expands the model\'s expressiveness. By defining φ(x) = [1, x₁, x₂, x₁x₂, x₁², x₂², ...], a linear model in φ-space is nonlinear in the original x-space.',
  },

  {
    id: 15,
    type: 'blank',
    category: 'Feature Engineering',
    source: { lecture: 'Lecture 9: Additional Topics in Regression', topic: 'Encoding Categorical Data' },
    prompt: 'Fill in the blanks about encoding categorical features.',
    text: 'A categorical feature that implies a natural order (e.g., T-shirt size: XL > L > M) is called an ___BLANK1___ feature and should be encoded using ___BLANK2___ numerical mapping. A categorical feature with no inherent order (e.g., T-shirt color) is called a ___BLANK3___ feature and should be encoded using ___BLANK4___ encoding, where each category becomes a binary column. When using an intercept in linear regression, one category should be ___BLANK5___ to avoid multicollinearity.',
    blanks: [
      ['ordinal'],
      ['ordered', 'numerical', 'integer', 'ranked'],
      ['nominal'],
      ['one-hot', 'one hot'],
      ['dropped', 'removed', 'omitted']
    ],
    modelAnswer: 'BLANK1: ordinal, BLANK2: ordered, BLANK3: nominal, BLANK4: one-hot, BLANK5: dropped',
    explanation: 'One-hot encoding: Monday→[1,0,0], Tuesday→[0,1,0], Sunday→[0,0,1]. Drop one category when intercept is used to avoid the dummy variable trap (perfect multicollinearity).',
  },

  {
    id: 16,
    type: 'ox',
    category: 'Feature Engineering',
    source: { lecture: 'Lecture 6 & 9', topic: 'Feature Engineering Concepts' },
    prompt: 'Determine whether each statement about feature engineering is True or False.',
    subs: [
      {
        statement: 'Polynomial features allow a linear regression model to capture nonlinear relationships by transforming the input space.',
        answer: true,
        explanation: 'Correct. By adding x², x³, x·x₂ etc. as features, a model that is linear in these new features becomes nonlinear in the original features. This is the basis of polynomial regression.'
      },
      {
        statement: 'Ordinal categorical features should always be encoded using one-hot encoding.',
        answer: false,
        explanation: 'False. Ordinal features (e.g., XL > L > M) have a natural order and should use ordered numerical mapping (e.g., 3, 2, 1). One-hot encoding discards this ordering information and is appropriate for nominal features.'
      },
      {
        statement: 'When an intercept term is included in linear regression, one category should be dropped during one-hot encoding to avoid the dummy variable trap.',
        answer: true,
        explanation: 'Correct. With K categories, one-hot creates K binary columns that sum to 1. If an intercept is present, the K columns are linearly dependent with the intercept column, causing multicollinearity (X^T X is not invertible).'
      },
      {
        statement: 'Log transformation of a feature can help reduce the influence of outliers and handle right-skewed distributions.',
        answer: true,
        explanation: 'Correct. Log transformation compresses large values, reducing the effect of outliers. It is commonly applied to right-skewed distributions like house prices or income.'
      },
      {
        statement: 'An interaction feature is formed by summing two existing features.',
        answer: false,
        explanation: 'False. An interaction feature is formed by taking the PRODUCT of two (or more) features, e.g., area × quality. Summing features is not an interaction — it is just feature combination by addition.'
      }
    ],
  },

  {
    id: 17,
    type: 'code-blank',
    category: 'Feature Engineering',
    source: { lecture: 'Lecture 6 & Practice 7: Polynomial Regression', topic: 'PolynomialFeatures Pipeline' },
    prompt: 'Fill in the blanks to build a polynomial regression pipeline using scikit-learn.',
    code: `from sklearn.preprocessing import PolynomialFeatures
from sklearn.linear_model import LinearRegression
from sklearn.pipeline import Pipeline

# Build a degree-2 polynomial regression pipeline
pipe = Pipeline([
    ('poly',  PolynomialFeatures(degree=___BLANK1___, include_bias=False)),
    ('lr',    LinearRegression())
])

pipe.___BLANK2___(X_train, y_train)

print("Train R² score:", round(pipe.score(X_train, y_train), 4))
print("Test  R² score:", round(pipe.score(___BLANK3___, y_test), 4))`,
    blanks: [
      ['2'],
      ['fit'],
      ['X_test']
    ],
    modelAnswer: 'BLANK1: 2, BLANK2: fit, BLANK3: X_test',
    explanation: 'PolynomialFeatures(degree=2) generates [x, x², x₁x₂] from [x₁, x₂]. Inside a Pipeline, LinearRegression then fits a linear model in this expanded space.',
  },

  // =====================================================================
  // CATEGORY: Cross-Validation  (Q18-Q20)
  // =====================================================================
  {
    id: 18,
    type: 'short',
    category: 'Cross-Validation',
    source: { lecture: 'Lecture 7: Cross-Validation', topic: 'K-Fold CV & Data Leakage' },
    prompt: 'Describe K-fold cross-validation. Also, define data leakage and explain one way it can occur in a cross-validation workflow.',
    keywords: {
      required: ['k folds', 'validation', 'average', 'data leakage', 'training'],
      optional: ['every sample', 'once', 'k-1', 'outside', 'scaler', 'pipeline', 'preprocessing', 'split'],
      synonyms: {
        'k folds': ['k-fold', 'k fold', 'folds', 'fold'],
        'data leakage': ['leakage', 'data leak', 'information leakage'],
        'average': ['averaging', 'mean'],
        'scaler': ['standardscaler', 'scaling', 'standardization'],
      },
      minOptional: 2
    },
    modelAnswer: 'In K-fold cross-validation, the dataset is divided into K equal folds. In each of K rounds, one fold serves as the validation set and the remaining K-1 folds are used for training. The validation error is averaged over K rounds to obtain a stable estimate of performance. Data leakage occurs when information from outside the training set enters the model. Example: fitting a StandardScaler on the full dataset (train + test) before splitting — the scaler then contains statistical information from the test set, causing overly optimistic evaluation. Prevention: use Pipeline so preprocessing is fit only on the training fold.',
    explanation: 'K-fold uses every sample for validation exactly once. Common K values: 5 or 10. Data leakage examples: fitting scaler on all data, selecting features on all data, or repeatedly checking test accuracy during tuning.',
  },

  {
    id: 19,
    type: 'blank',
    category: 'Cross-Validation',
    source: { lecture: 'Lecture 7: Cross-Validation', topic: 'K-Fold CV Mechanics' },
    prompt: 'Fill in the blanks about K-fold cross-validation.',
    text: 'In K-fold cross-validation, the dataset is divided into K equal-sized subsets called ___BLANK1___. In each round, one subset is used as the ___BLANK2___ set while the remaining K-1 subsets are used for training. Each sample appears in the validation set exactly ___BLANK3___ time(s). The final cross-validation score is the ___BLANK4___ of the K individual validation scores. This method is especially useful when the dataset is ___BLANK5___.',
    blanks: [
      ['folds', 'fold'],
      ['validation'],
      ['one', 'once', '1'],
      ['average', 'mean'],
      ['small', 'limited', 'not large']
    ],
    modelAnswer: 'BLANK1: folds, BLANK2: validation, BLANK3: once/one, BLANK4: average/mean, BLANK5: small',
    explanation: 'CV MSE = (1/K) Σᵢ MSEᵢ. With K=5 and N=100 samples, each fold has 20 samples. Every sample is used for training 4 times and for validation once.',
  },

  {
    id: 20,
    type: 'code-explain',
    category: 'Cross-Validation',
    source: { lecture: 'Lecture 7: Cross-Validation', topic: 'Data Leakage in CV' },
    prompt: 'The following code has a data leakage problem. Explain what went wrong and how to fix it.',
    code: `from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import cross_val_score
from sklearn.linear_model import LogisticRegression

# A student preprocesses ALL data before cross-validation
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)   # fit_transform on the ENTIRE dataset!

# Then performs cross-validation on the already-scaled data
scores = cross_val_score(LogisticRegression(), X_scaled, y, cv=5)
print("Mean CV Accuracy:", scores.mean())`,
    keywords: {
      required: ['data leakage', 'fit', 'all data', 'test', 'training'],
      optional: ['scaler', 'pipeline', 'fit_transform', 'validation fold', 'inside', 'preprocessing', 'cross_val_score'],
      synonyms: {
        'data leakage': ['leakage', 'data leak'],
        'all data': ['entire dataset', 'full dataset', 'all samples'],
        'training': ['training fold', 'training set'],
      },
      minOptional: 2
    },
    modelAnswer: 'Problem: `scaler.fit_transform(X)` fits the StandardScaler on the ENTIRE dataset, including the validation folds. This is data leakage — each validation fold\'s mean and variance influence the scaler, so the model indirectly sees information from the validation set during training. This leads to overly optimistic cross-validation scores. Fix: wrap the scaler and classifier in a Pipeline and pass the unfitted Pipeline to cross_val_score. Inside each CV fold, the Pipeline will fit the scaler only on the training portion.',
    explanation: 'Correct code: pipe = Pipeline([(\'scaler\', StandardScaler()), (\'clf\', LogisticRegression())]); scores = cross_val_score(pipe, X, y, cv=5). The scaler is fitted fresh on each training fold.',
  },

  // =====================================================================
  // CATEGORY: Hyperparameter Tuning  (Q21-Q23)
  // =====================================================================
  {
    id: 21,
    type: 'short',
    category: 'Hyperparameter Tuning',
    source: { lecture: 'Lecture 8: Hyperparameter Tuning', topic: 'Parameters vs. Hyperparameters' },
    prompt: 'What is the difference between model parameters and hyperparameters? Give at least one concrete example of each.',
    keywords: {
      required: ['model parameters', 'learned', 'training', 'hyperparameters', 'set before'],
      optional: ['weights', 'coefficients', 'alpha', 'ridge', 'k', 'degree', 'cross-validation', 'optimization', 'validation'],
      synonyms: {
        'model parameters': ['parameters', 'model weights'],
        'hyperparameters': ['hyperparameter'],
        'learned': ['optimized', 'estimated', 'fitted', 'automatically learned'],
        'set before': ['specified before', 'chosen before', 'configured before'],
      },
      minOptional: 2
    },
    modelAnswer: 'Model parameters are values learned automatically by the training algorithm from the data — examples: the weight vector w in linear regression, coefficients in logistic regression. Hyperparameters are settings specified BEFORE training that are not learned by the fitting algorithm — examples: regularization parameter α in Ridge regression, polynomial degree in polynomial regression, or K in KNN. Hyperparameters are typically selected by evaluating performance on a validation set or by cross-validation.',
    explanation: 'Model params: learned by gradient descent or closed-form. Hyperparams: set by the user, tuned by grid search / random search using validation performance.',
  },

  {
    id: 22,
    type: 'blank',
    category: 'Hyperparameter Tuning',
    source: { lecture: 'Lecture 8: Hyperparameter Tuning', topic: 'Pipeline & GridSearchCV' },
    prompt: 'Fill in the blanks about scikit-learn tools for hyperparameter tuning.',
    text: 'In scikit-learn, ___BLANK1___ chains multiple preprocessing steps and a model into a single estimator, which helps prevent data leakage during cross-validation. ___BLANK2___ performs an exhaustive search over all combinations in a predefined hyperparameter grid and evaluates each combination using cross-validation. After fitting, the attribute ___BLANK3___ contains the best hyperparameter setting found.',
    blanks: [
      ['Pipeline'],
      ['GridSearchCV'],
      ['best_params_', 'best_params']
    ],
    modelAnswer: 'BLANK1: Pipeline, BLANK2: GridSearchCV, BLANK3: best_params_',
    explanation: 'GridSearchCV with a Pipeline: the entire pipeline (including preprocessing) is refit on each training fold, eliminating data leakage. Alternatively, RandomizedSearchCV samples a fixed number of random combinations — faster for large search spaces.',
  },

  {
    id: 23,
    type: 'ox',
    category: 'Hyperparameter Tuning',
    source: { lecture: 'Lecture 8: Hyperparameter Tuning', topic: 'Hyperparameter Tuning Concepts' },
    prompt: 'Determine whether each statement about hyperparameter tuning is True or False.',
    subs: [
      {
        statement: 'Model parameters such as the weight vector in linear regression are learned automatically from the training data.',
        answer: true,
        explanation: 'Correct. Model parameters (weights, biases) are the outputs of the training process — they are computed by minimizing a loss function or maximizing a likelihood.'
      },
      {
        statement: 'The regularization parameter α in Ridge regression is a model parameter learned during training.',
        answer: false,
        explanation: 'False. α is a hyperparameter. It controls how much regularization to apply and must be specified before training. It is not updated by the fitting algorithm.'
      },
      {
        statement: 'Grid search evaluates every possible combination of hyperparameter values specified in the grid.',
        answer: true,
        explanation: 'Correct. GridSearchCV is exhaustive — if you specify 3 values for C and 4 values for γ, it evaluates all 3×4 = 12 combinations using cross-validation.'
      },
      {
        statement: 'Hyperparameters should be selected based on test set performance to ensure the best final model.',
        answer: false,
        explanation: 'False. Hyperparameters must be selected using the validation set (or cross-validation), NOT the test set. Using the test set for hyperparameter selection causes data leakage and over-optimistic estimates.'
      },
      {
        statement: 'Wrapping preprocessing and a model in a Pipeline prevents data leakage by fitting preprocessing only on the training data within each cross-validation fold.',
        answer: true,
        explanation: 'Correct. Inside GridSearchCV, the Pipeline refits all steps (including scalers) on each training fold. This prevents information from the validation fold leaking into the preprocessing.'
      }
    ],
  },

  // =====================================================================
  // CATEGORY: Classification  (Q24-Q28)
  // =====================================================================
  {
    id: 24,
    type: 'short',
    category: 'Classification',
    source: { lecture: 'Lecture 10 & 11: Classification & Logistic Regression', topic: 'Evaluation Metrics' },
    prompt: 'Define precision, recall, and F1-score for binary classification. Explain when each is the most appropriate metric to use.',
    keywords: {
      required: ['precision', 'predicted positive', 'recall', 'actual positive', 'f1', 'harmonic mean'],
      optional: ['true positive', 'false positive', 'false negative', 'imbalanced', 'tradeoff', 'tp', 'fp', 'fn'],
      synonyms: {
        'predicted positive': ['predicted as positive', 'classified as positive'],
        'actual positive': ['truly positive', 'true positive samples', 'ground truth positive'],
        'harmonic mean': ['harmonic average'],
      },
      minOptional: 2
    },
    modelAnswer: 'Precision = TP / (TP + FP): of all samples predicted as positive, the fraction that are truly positive. Use when false positives are costly (e.g., spam detection). Recall = TP / (TP + FN): of all truly positive samples, the fraction correctly predicted. Use when false negatives are costly (e.g., cancer detection). F1-score = 2 × Precision × Recall / (Precision + Recall): the harmonic mean of precision and recall. Best when you want a single balanced metric, especially for imbalanced classes.',
    explanation: 'Accuracy = (TP+TN)/(P+N) can be misleading for imbalanced data. F1 is the harmonic mean (not arithmetic), so it is low if either precision or recall is low.',
  },

  {
    id: 25,
    type: 'blank',
    category: 'Classification',
    source: { lecture: 'Lecture 10 & 11', topic: 'Sigmoid, Cross-entropy' },
    prompt: 'Fill in the blanks about binary logistic regression.',
    text: 'In binary logistic regression, the linear score (logit) a is converted to a class probability by the ___BLANK1___ function: p = 1 / (1 + exp(-a)). Class 1 is predicted when this probability exceeds ___BLANK2___. The loss function used to train logistic regression is the ___BLANK3___ error, which is the negative ___BLANK4___ of the class labels. This loss function is equivalent to maximizing the ___BLANK5___ of the training data.',
    blanks: [
      ['sigmoid', 'logistic sigmoid', 'logistic'],
      ['0.5', '50%', '0.5 (50%)'],
      ['cross-entropy', 'cross entropy'],
      ['log-likelihood', 'log likelihood'],
      ['likelihood']
    ],
    modelAnswer: 'BLANK1: sigmoid, BLANK2: 0.5, BLANK3: cross-entropy, BLANK4: log-likelihood, BLANK5: likelihood',
    explanation: 'σ(a) = 1/(1+e^{-a}). Predict class 1 if σ(a) ≥ 0.5, class 0 otherwise. Cross-entropy = -Σ[t_n ln(y_n) + (1-t_n) ln(1-y_n)].',
  },

  {
    id: 26,
    type: 'blank',
    category: 'Classification',
    source: { lecture: 'Lecture 11: Logistic Regression', topic: 'Softmax for Multi-class' },
    prompt: 'Fill in the blanks about multi-class logistic regression.',
    text: 'For multi-class classification with K classes, each class k has its own ___BLANK1___ vector w_k that produces a linear score (logit) a_k = w_k^T x. The ___BLANK2___ function converts all K logits into class probabilities that sum to ___BLANK3___. The predicted class is the one with the ___BLANK4___ probability: ŷ = argmax_k p(C_k|x). In scikit-learn, LogisticRegression handles multi-class automatically using ___BLANK5___ gradient descent.',
    blanks: [
      ['weight', 'weight vector'],
      ['softmax'],
      ['1', 'one', '1.0'],
      ['highest', 'largest', 'maximum'],
      ['stochastic', 'gradient']
    ],
    modelAnswer: 'BLANK1: weight, BLANK2: softmax, BLANK3: 1, BLANK4: highest/largest, BLANK5: stochastic',
    explanation: 'Softmax: p(C_k|x) = exp(a_k) / Σⱼ exp(aⱼ). The denominator normalizes so all probabilities sum to 1. For K=2, softmax reduces to the sigmoid function.',
  },

  {
    id: 27,
    type: 'ox',
    category: 'Classification',
    source: { lecture: 'Lecture 10 & 11', topic: 'Classification Concepts' },
    prompt: 'Determine whether each statement about classification is True or False.',
    subs: [
      {
        statement: 'Accuracy is always a reliable metric for evaluating classification models.',
        answer: false,
        explanation: 'False. Accuracy is misleading when classes are imbalanced. For example, if 95% of samples are negative, a model that always predicts "negative" achieves 95% accuracy but has zero ability to detect positives.'
      },
      {
        statement: 'The sigmoid function converts the logit (linear score) to a class probability between 0 and 1 in binary logistic regression.',
        answer: true,
        explanation: 'Correct. σ(a) = 1/(1+e^{-a}) maps any real-valued logit a to the interval (0, 1), which can be interpreted as a class probability.'
      },
      {
        statement: 'High recall means the model correctly identifies most actual positive cases in the dataset.',
        answer: true,
        explanation: 'Correct. Recall = TP/(TP+FN). High recall means FN (false negatives, missed positives) is small. This is critical in medical diagnosis where missing a positive case (e.g., a disease) is dangerous.'
      },
      {
        statement: 'The softmax function is used for binary classification, while the sigmoid function is used for multi-class classification.',
        answer: false,
        explanation: 'False. It is the opposite: sigmoid is for binary classification, and softmax is for multi-class classification (K > 2). Softmax generalizes the sigmoid to multiple classes.'
      },
      {
        statement: 'The F1-score is the harmonic mean (not the arithmetic mean) of precision and recall.',
        answer: true,
        explanation: 'Correct. F1 = 2×P×R/(P+R). The harmonic mean penalizes extreme imbalances between precision and recall more severely than the arithmetic mean would, making it a better balanced measure.'
      }
    ],
  },

  {
    id: 28,
    type: 'code-explain',
    category: 'Classification',
    source: { lecture: 'Lecture 11 & Practice 12', topic: 'Logistic Regression Feature Scaling' },
    prompt: 'The following logistic regression code may produce suboptimal results. Identify the problem and explain how to fix it.',
    code: `from sklearn.linear_model import LogisticRegression

# A student directly fits logistic regression without any preprocessing
clf = LogisticRegression(random_state=2026)
clf.fit(X_train, y_train)   # X_train has features with very different ranges

y_pred = clf.predict(X_test)
print("Accuracy:", (y_pred == y_test).mean())`,
    keywords: {
      required: ['feature scaling', 'regularization', 'standardization'],
      optional: ['standardscaler', 'different scales', 'penalty', 'unfair', 'pipeline', 'magnitude', 'scaler'],
      synonyms: {
        'feature scaling': ['scaling', 'scale', 'standardize', 'normalization'],
        'regularization': ['regularized', 'l2 penalty', 'default penalty'],
        'standardization': ['standardscaler', 'standard scaler'],
      },
      minOptional: 1
    },
    modelAnswer: 'Problem: Logistic regression in scikit-learn applies L2 regularization by default. Without feature scaling, features with different numeric ranges produce weights of very different magnitudes. This leads to unfair regularization — weights for features with smaller numeric ranges are penalized more heavily relative to their predictive importance. Fix: add StandardScaler before LogisticRegression using a Pipeline: Pipeline([(\'scaler\', StandardScaler()), (\'clf\', LogisticRegression())]). This ensures equal regularization treatment across all features.',
    explanation: 'Rule: always scale features before any model that uses regularization (logistic regression, Ridge, SVM, etc.) or distance metrics (KNN). The Pipeline guarantees the scaler is fitted only on training data.',
  },

  // =====================================================================
  // CATEGORY: KNN Classification  (Q29-Q32)
  // =====================================================================
  {
    id: 29,
    type: 'short',
    category: 'KNN Classification',
    source: { lecture: 'Lecture 12: KNN Classification', topic: 'KNN Algorithm Steps' },
    prompt: 'Describe the K-Nearest Neighbor (KNN) classification algorithm step by step. How does the value of K affect the decision boundary?',
    keywords: {
      required: ['distance', 'k nearest', 'majority voting', 'neighbors'],
      optional: ['euclidean', 'sort', 'training samples', 'predict', 'class', 'small k', 'large k', 'complex', 'smooth'],
      synonyms: {
        'distance': ['distances', 'compute distance', 'euclidean distance'],
        'majority voting': ['majority vote', 'vote', 'most votes', 'mode'],
        'k nearest': ['K nearest neighbors', 'nearest neighbors'],
      },
      minOptional: 2
    },
    modelAnswer: 'KNN: (1) Compute the distance from the test sample to every training sample. (2) Sort training samples by distance in ascending order. (3) Select the K nearest training samples. (4) Predict the class by majority voting — the class with the most votes among the K neighbors. Effect of K: Small K → complex, noisy boundary; sensitive to individual training points. Large K → smooth, stable boundary; may oversmooth and lose local patterns. Odd K is preferred for binary classification to avoid ties.',
    explanation: 'KNN stores all training data (non-parametric). Time complexity at prediction: O(N·D) per test sample where N = training samples, D = dimensions. Feature scaling is essential.',
  },

  {
    id: 30,
    type: 'blank',
    category: 'KNN Classification',
    source: { lecture: 'Lecture 12: KNN Classification', topic: 'KNN vs. Logistic Regression' },
    prompt: 'Fill in the blanks comparing KNN and logistic regression.',
    text: 'Unlike logistic regression, which is a ___BLANK1___ model that learns explicit weight parameters from training data, KNN is a ___BLANK2___ model that does not learn parameters but instead ___BLANK3___ all training samples. KNN produces a ___BLANK4___ decision boundary, while logistic regression produces a ___BLANK5___ boundary. KNN requires more ___BLANK6___ at prediction time because it must compute distances to all training samples.',
    blanks: [
      ['parametric'],
      ['non-parametric', 'nonparametric'],
      ['stores', 'memorizes', 'keeps'],
      ['highly nonlinear', 'nonlinear', 'complex'],
      ['linear'],
      ['computation', 'time', 'memory']
    ],
    modelAnswer: 'BLANK1: parametric, BLANK2: non-parametric, BLANK3: stores, BLANK4: nonlinear, BLANK5: linear, BLANK6: computation/time',
    explanation: 'Logistic regression: fast prediction O(D), but only linear boundary. KNN: slow prediction O(N·D), but arbitrary boundary. KNN memory scales with N (training set size).',
  },

  {
    id: 31,
    type: 'ox',
    category: 'KNN Classification',
    source: { lecture: 'Lecture 12: KNN Classification', topic: 'KNN Concepts' },
    prompt: 'Determine whether each statement about KNN classification is True or False.',
    subs: [
      {
        statement: 'KNN is a parametric model because it learns a fixed number of parameters during training.',
        answer: false,
        explanation: 'False. KNN is non-parametric: it does not learn fixed parameters. Instead, it stores the entire training dataset and makes predictions at test time by computing distances. The "parameters" grow with the training data size.'
      },
      {
        statement: 'KNN requires feature scaling because distance computation is sensitive to the magnitude of feature values.',
        answer: true,
        explanation: 'Correct. Without scaling, features with large numeric ranges dominate the Euclidean distance, making those features disproportionately influential. StandardScaler should be applied before KNN.'
      },
      {
        statement: 'Using an odd value of K in binary classification reduces the probability of a tie in majority voting.',
        answer: true,
        explanation: 'Correct. With 2 classes and K neighbors, an odd K guarantees one class has strictly more votes than the other (e.g., 3 votes to 2), avoiding ties. An even K could result in 2-to-2 ties.'
      },
      {
        statement: 'KNN has faster prediction speed than logistic regression because it does not need to store model weights.',
        answer: false,
        explanation: 'False. KNN prediction is slow — it must compute distances to every training sample for each new input (O(N·D) per prediction). Logistic regression is fast — prediction is just a single dot product (O(D)).'
      },
      {
        statement: 'Increasing K in KNN generally leads to a smoother and more stable decision boundary.',
        answer: true,
        explanation: 'Correct. Larger K averages over more neighbors, making the decision boundary smoother and less sensitive to individual noisy training points. However, too large a K may lose local patterns (underfitting).'
      }
    ],
  },

  {
    id: 32,
    type: 'code-explain',
    category: 'KNN Classification',
    source: { lecture: 'Lecture 12 & Practice 14', topic: 'KNN Feature Scaling' },
    prompt: 'The following KNN code may perform poorly on unscaled data. Identify the problem and how to fix it.',
    code: `from sklearn.neighbors import KNeighborsClassifier

# A student trains KNN directly on raw, unscaled features
knn = KNeighborsClassifier(n_neighbors=5)
knn.fit(X_train, y_train)   # X_train has features with very different value ranges

y_pred = knn.predict(X_test)
print("Test Accuracy:", (y_pred == y_test).mean())`,
    keywords: {
      required: ['feature scaling', 'distance', 'dominant', 'standardscaler'],
      optional: ['magnitude', 'large', 'knn', 'standardization', 'pipeline', 'euclidean', 'ranges'],
      synonyms: {
        'feature scaling': ['scaling', 'scale', 'standardize'],
        'dominant': ['dominates', 'dominate'],
        'standardscaler': ['standard scaler', 'standardization'],
      },
      minOptional: 1
    },
    modelAnswer: 'Problem: KNN relies on Euclidean distance to find nearest neighbors. Without feature scaling, features with larger numeric ranges dominate the distance computation — a 1-unit difference in annual income (range ~100,000) overwhelms the entire contribution of age (range ~10). This makes the distance metric unfair and the nearest-neighbor search meaningless. Fix: use a Pipeline with StandardScaler before KNeighborsClassifier: Pipeline([(\'scaler\', StandardScaler()), (\'knn\', KNeighborsClassifier(n_neighbors=5))]).',
    explanation: 'After StandardScaler, all features have mean 0 and std 1. Then 1-unit differences in any feature contribute equally to the Euclidean distance.',
  },

  // =====================================================================
  // CATEGORY: Decision Tree  (Q33-Q37)
  // =====================================================================
  {
    id: 33,
    type: 'short',
    category: 'Decision Tree',
    source: { lecture: 'Lecture 13: Decision Tree', topic: 'CART Algorithm & Gini Impurity' },
    prompt: 'Explain the CART algorithm for building a decision tree. How is the Gini impurity used to select the best split at each node?',
    keywords: {
      required: ['cart', 'gini', 'impurity', 'split', 'recursive'],
      optional: ['binary', 'greedy', 'information gain', 'entropy', 'leaf node', 'stopping', 'reduction', 'threshold'],
      synonyms: {
        'cart': ['classification and regression trees'],
        'gini': ['gini impurity', 'gini index'],
        'recursive': ['recursively', 'recursive binary splitting'],
        'impurity': ['impurity measure', 'node impurity'],
        'reduction': ['impurity reduction', 'gini gain'],
      },
      minOptional: 2
    },
    modelAnswer: 'CART (Classification and Regression Trees) builds a binary tree by recursively and greedily selecting the best split at each node. At each step: (1) For each feature and each possible threshold, compute the resulting Gini impurity in the two child nodes. (2) The best split is the one that maximizes the impurity reduction (Gini gain) = parent impurity − weighted average child impurities. (3) The selected split creates two child nodes. (4) Repeat recursively until a stopping criterion is met (e.g., max_depth, min_samples_split, or all leaves pure). Each leaf node is assigned the majority class of its samples.',
    explanation: 'Gini = 1 − Σ_k p_k². For 2 classes: Gini = 1 − (p₁² + p₂²). A pure node has Gini=0. The alternative splitting criterion is information gain (using entropy = −Σp_k log p_k).',
  },

  {
    id: 34,
    type: 'blank',
    category: 'Decision Tree',
    source: { lecture: 'Lecture 13: Decision Tree', topic: 'Gini Impurity & Splitting Criteria' },
    prompt: 'Fill in the blanks about Gini impurity and decision tree splitting criteria.',
    text: 'Gini impurity for a node is defined as 1 minus the sum of ___BLANK1___ for all K classes, where p_k is the fraction of class k samples in the node. A Gini value of ___BLANK2___ indicates a pure node where all samples belong to one class. The impurity reduction from a split is called ___BLANK3___ gain (when using Gini) or ___BLANK4___ gain (when using entropy). The CART algorithm selects the split that ___BLANK5___ the impurity reduction.',
    blanks: [
      ['squared class probabilities', 'squared probabilities', 'p_k squared', 'p_k^2'],
      ['0', 'zero'],
      ['Gini', 'gini'],
      ['information', 'entropy'],
      ['maximizes', 'maximum']
    ],
    modelAnswer: 'BLANK1: squared class probabilities, BLANK2: 0, BLANK3: Gini, BLANK4: information, BLANK5: maximizes',
    explanation: 'Gini gain = Gini(parent) − [N_L/N × Gini(left) + N_R/N × Gini(right)]. Both Gini and entropy produce similar results in practice; Gini is faster to compute.',
  },

  {
    id: 35,
    type: 'ox',
    category: 'Decision Tree',
    source: { lecture: 'Lecture 13: Decision Tree', topic: 'Decision Tree Concepts' },
    prompt: 'Determine whether each statement about decision trees is True or False.',
    subs: [
      {
        statement: 'Decision trees require feature scaling (e.g., standardization) for correct training.',
        answer: false,
        explanation: 'False. Decision trees make splits based on feature thresholds, not distances. The splitting criterion (Gini, entropy) is invariant to monotonic transformations of features. Feature scaling is NOT required for decision trees.'
      },
      {
        statement: 'Deeper decision trees are more prone to overfitting.',
        answer: true,
        explanation: 'Correct. Deeper trees have more splits and can create highly specific leaf nodes that memorize individual training samples. This leads to low training error but high test error (overfitting). Limiting max_depth is key to controlling this.'
      },
      {
        statement: 'The decision boundary of a decision tree consists of axis-aligned rectangular regions in the feature space.',
        answer: true,
        explanation: 'Correct. Each split is a threshold on a single feature (e.g., x₁ < 2.5), which creates axis-aligned boundaries. The resulting decision regions are rectangles (or hyper-rectangles in higher dimensions). Oblique splits are not used in CART.'
      },
      {
        statement: 'Decision trees are interpretable models because the learned split rules can be visualized and explained.',
        answer: true,
        explanation: 'Correct. A decision tree can be visualized as a flowchart of if-else rules. This is one of the main advantages: each prediction can be traced back through the tree to the specific splits that led to it, making it explainable.'
      },
      {
        statement: 'Setting max_depth=None in scikit-learn\'s DecisionTreeClassifier allows the tree to grow until all leaves are pure, which typically leads to underfitting.',
        answer: false,
        explanation: 'False. max_depth=None leads to OVERFITTING, not underfitting. With unlimited depth, the tree memorizes all training samples (training accuracy → 100%), but generalizes poorly to unseen data (high test error).'
      }
    ],
  },

  {
    id: 36,
    type: 'code-blank',
    category: 'Decision Tree',
    source: { lecture: 'Lecture 13 & Practice 15', topic: 'sklearn DecisionTreeClassifier' },
    prompt: 'Fill in the blanks to train a decision tree classifier using scikit-learn.',
    code: `from sklearn.tree import DecisionTreeClassifier

# Train a Decision Tree with limited depth to avoid overfitting
clf = DecisionTreeClassifier(
    max_depth=___BLANK1___,       # Limit tree depth to control overfitting
    criterion='___BLANK2___',     # Splitting criterion (Gini or entropy)
    random_state=2026
)

clf.___BLANK3___(X_train, y_train)

print("Training accuracy:", clf.score(X_train, y_train))
print("Test accuracy    :", clf.score(___BLANK4___, y_test))`,
    blanks: [
      ['3', '4', '5'],
      ['gini', 'entropy'],
      ['fit'],
      ['X_test']
    ],
    modelAnswer: 'BLANK1: 3 (any positive integer), BLANK2: gini or entropy, BLANK3: fit, BLANK4: X_test',
    explanation: 'max_depth controls overfitting. criterion=\'gini\' uses Gini impurity; criterion=\'entropy\' uses information gain. Both usually give similar results; Gini is slightly faster.',
  },

  {
    id: 37,
    type: 'code-explain',
    category: 'Decision Tree',
    source: { lecture: 'Lecture 13 & Practice 15', topic: 'Decision Tree Overfitting' },
    prompt: 'The training accuracy is 1.0 but the test accuracy is much lower. Explain why this happens and how to fix it.',
    code: `from sklearn.tree import DecisionTreeClassifier

clf = DecisionTreeClassifier(max_depth=None, random_state=2026)
clf.fit(X_train, y_train)

print("Training accuracy:", clf.score(X_train, y_train))  # 1.0000
print("Test accuracy    :", clf.score(X_test, y_test))    # 0.8133`,
    keywords: {
      required: ['max_depth', 'none', 'overfitting'],
      optional: ['pure', 'memorize', 'training data', 'unlimited', 'cross-validation', 'high variance'],
      synonyms: {
        'none': ['max_depth=none', 'unlimited depth', 'no limit', 'unrestricted'],
        'overfitting': ['overfit', 'overfits'],
        'memorize': ['memorizes', 'memorization'],
      },
      minOptional: 1
    },
    modelAnswer: 'With max_depth=None, the decision tree grows until all leaf nodes are pure (every leaf contains samples of only one class). The tree memorizes every training sample, achieving 100% training accuracy. However, it has learned the noise and specific patterns of the training data, and fails to generalize to unseen test data (overfitting / high variance). Fix: set max_depth to a small value (e.g., 3–5) or tune it via cross-validation. Alternatively, use min_samples_split or min_samples_leaf to control tree growth.',
    explanation: 'Training accuracy 1.0 + test accuracy << 1.0 is the classic signature of overfitting. Pruning (limiting max_depth) or using Random Forest (ensemble) are standard fixes.',
  },

  // =====================================================================
  // CATEGORY: SVM  (Q38-Q43)
  // =====================================================================
  {
    id: 38,
    type: 'short',
    category: 'SVM',
    source: { lecture: 'Lecture 14: Support Vector Machine 1', topic: 'Margin & Why Maximize It' },
    prompt: 'What is the margin in a Support Vector Machine? Identify what support vectors are and explain why maximizing the margin improves generalization.',
    keywords: {
      required: ['margin', 'decision boundary', 'support vectors', 'maximizing', 'generalization'],
      optional: ['perpendicular distance', 'closest', 'training points', 'robustness', 'noise', 'wider', 'geometric'],
      synonyms: {
        'margin': ['geometric margin', 'margin width'],
        'support vectors': ['support vector', 'points on the margin'],
        'maximizing': ['maximize', 'maximum'],
        'generalization': ['generalize', 'generalizes'],
      },
      minOptional: 2
    },
    modelAnswer: 'The margin is the perpendicular distance from the decision boundary to the nearest training samples. Support vectors are those nearest training samples — the only points that lie exactly on or within the margin boundaries. SVM maximizes this margin because a wider margin provides greater geometric robustness: the classifier tolerates more perturbation or measurement noise before a sample crosses the boundary and gets misclassified. This robustness to noise translates to better generalization to unseen data.',
    explanation: 'Margin = 2/||w||. Maximizing the margin ↔ minimizing ||w||² subject to t_n(w^T φ(x_n) + b) ≥ 1 ∀n. Only support vectors (where aₙ > 0) determine the decision boundary.',
  },

  {
    id: 39,
    type: 'short',
    category: 'SVM',
    source: { lecture: 'Lecture 15: Support Vector Machine 2', topic: 'Kernel Trick' },
    prompt: 'Explain the kernel trick in SVM. What problem does it solve, and how does it work mathematically?',
    keywords: {
      required: ['kernel', 'inner product', 'kernel function', 'high-dimensional', 'nonlinear'],
      optional: ['mapping', 'feature space', 'rbf', 'polynomial', 'computationally', 'expensive', 'boundary', 'φ'],
      synonyms: {
        'kernel': ['kernel trick', 'kernel function'],
        'inner product': ['dot product', 'inner products'],
        'high-dimensional': ['high dimensional', 'higher dimensional', 'infinite dimensional'],
        'nonlinear': ['non-linear', 'nonlinear boundary'],
      },
      minOptional: 2
    },
    modelAnswer: 'The kernel trick solves the problem of non-linearly separable data. SVM\'s decision function depends on training data only through inner products ⟨φ(xₙ), φ(x)⟩. Computing the feature mapping φ(x) explicitly can be computationally prohibitive (possibly infinite-dimensional). The kernel function k(x, x\') = ⟨φ(x), φ(x\')⟩ evaluates this inner product directly without computing φ. By replacing inner products with kernel evaluations, SVM can implicitly operate in a very high-dimensional feature space and learn nonlinear decision boundaries in the original space. Common kernels: linear, polynomial, RBF (Gaussian).',
    explanation: 'SVM classifier: y(x) = Σₙ aₙtₙk(x, xₙ) + b. The kernel replaces φ(x)^T φ(x\') everywhere. RBF kernel: k(x,x\')=exp(-γ||x-x\'||²) corresponds to infinite-dimensional feature space.',
  },

  {
    id: 40,
    type: 'blank',
    category: 'SVM',
    source: { lecture: 'Lecture 14: Support Vector Machine 1', topic: 'Soft-Margin SVM & C Parameter' },
    prompt: 'Fill in the blanks about soft-margin SVM and the regularization parameter C.',
    text: 'In soft-margin SVM, slack variables ξₙ ≥ 0 are introduced to allow some training points to violate the margin. The parameter C controls the trade-off between ___BLANK1___ width and training-error tolerance. A large C imposes a heavy penalty on margin violations, resulting in a ___BLANK2___ margin with fewer violations — behaving like ___BLANK3___ SVM. A small C tolerates more misclassifications in favor of a ___BLANK4___ margin, typically giving better ___BLANK5___ on noisy data.',
    blanks: [
      ['margin'],
      ['narrow', 'narrower', 'smaller'],
      ['hard-margin', 'hard margin'],
      ['wide', 'wider', 'larger'],
      ['generalization', 'test accuracy']
    ],
    modelAnswer: 'BLANK1: margin, BLANK2: narrow, BLANK3: hard-margin, BLANK4: wide, BLANK5: generalization',
    explanation: 'Soft-margin objective: min (1/2)||w||² + C Σξₙ  s.t. t_n(w^T φ(x_n)+b) ≥ 1−ξₙ. C→∞ → hard margin. C is a hyperparameter typically tuned by cross-validation over a log-scale grid (10⁻², ..., 10²).',
  },

  {
    id: 41,
    type: 'blank',
    category: 'SVM',
    source: { lecture: 'Lecture 15: Support Vector Machine 2', topic: 'RBF Kernel & γ Parameter' },
    prompt: 'Fill in the blanks about the RBF kernel and the role of the γ parameter.',
    text: 'The RBF (Gaussian) kernel is defined as k(x, x\') = exp(-γ||x - x\'||²). The kernel value is close to ___BLANK1___ when x ≈ x\' and decays to 0 as the distance grows. A large γ means each support vector has a ___BLANK2___ region of influence, leading to a highly ___BLANK3___ boundary that risks ___BLANK4___. A small γ produces a ___BLANK5___ boundary that risks underfitting.',
    blanks: [
      ['1', 'one', '1.0'],
      ['small', 'narrow', 'local'],
      ['flexible', 'complex'],
      ['overfitting', 'overfit'],
      ['smooth', 'simple', 'almost linear']
    ],
    modelAnswer: 'BLANK1: 1, BLANK2: small/narrow, BLANK3: flexible/complex, BLANK4: overfitting, BLANK5: smooth',
    explanation: 'γ = 1/(2σ²). Large γ (small σ) → very localized kernel; each support vector only influences nearby points. Small γ (large σ) → global influence; boundary is nearly linear. Tune C and γ together by cross-validation.',
  },

  {
    id: 42,
    type: 'ox',
    category: 'SVM',
    source: { lecture: 'Lecture 14, 15, 16', topic: 'SVM Concepts' },
    prompt: 'Determine whether each statement about SVMs is True or False.',
    subs: [
      {
        statement: 'SVM finds the decision boundary that minimizes the total training classification error.',
        answer: false,
        explanation: 'False. SVM maximizes the geometric margin (the distance to the nearest training points). It does not directly minimize training error — the goal is the maximum-margin boundary, not the minimum-error boundary.'
      },
      {
        statement: 'Support vectors are the only training points that determine the final SVM decision boundary.',
        answer: true,
        explanation: 'Correct. From the KKT conditions, only points with aₙ > 0 (on or inside the margin) are support vectors. All other points have aₙ = 0 and do not contribute to w or b. Removing non-support-vector points does not change the classifier.'
      },
      {
        statement: 'The kernel trick allows SVM to learn nonlinear decision boundaries by implicitly mapping data to a higher-dimensional feature space without explicit computation.',
        answer: true,
        explanation: 'Correct. By replacing inner products with kernel evaluations k(x, x\'), SVM can classify in a very high-dimensional (even infinite-dimensional) feature space while only computing the kernel function — much cheaper than computing φ(x) explicitly.'
      },
      {
        statement: 'In scikit-learn, LinearSVC uses the one-vs-one (OvO) strategy for multi-class classification by default.',
        answer: false,
        explanation: 'False. LinearSVC uses one-vs-rest (OvR) by default. sklearn.svm.SVC (kernel SVM) uses one-vs-one (OvO) internally. OvO: K(K-1)/2 classifiers; OvR: K classifiers.'
      },
      {
        statement: 'A larger C value in soft-margin SVM corresponds to a stricter (narrower) margin that tolerates fewer training-set violations.',
        answer: true,
        explanation: 'Correct. Large C imposes heavy penalty on slack variables ξₙ, so the optimizer prefers fewer violations at the cost of a narrower margin. In the limit C→∞, soft-margin SVM approaches hard-margin SVM.'
      }
    ],
  },

  {
    id: 43,
    type: 'code-blank',
    category: 'SVM',
    source: { lecture: 'Lecture 15, 16 & Practice 16, 17', topic: 'SVM Pipeline + GridSearch' },
    prompt: 'Fill in the blanks to build and tune an RBF kernel SVM classifier using a Pipeline and GridSearchCV.',
    code: `from sklearn.svm import SVC
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import GridSearchCV

# SVM is scale-sensitive: always standardize features first
pipe = Pipeline([
    ('scaler', ___BLANK1___()),
    ('svm',    SVC(kernel='___BLANK2___', random_state=2026))
])

param_grid = {
    'svm__C':     [0.1, 1.0, 10.0, 100.0],
    'svm__gamma': ['scale', 0.01, 0.1]
}

grid = GridSearchCV(pipe, param_grid, cv=___BLANK3___, scoring='accuracy')
grid.___BLANK4___(X_train, y_train)

print("Best params  :", grid.best_params_)
print("Test accuracy:", round(grid.score(X_test, y_test), 4))`,
    blanks: [
      ['StandardScaler'],
      ['rbf'],
      ['5', '3'],
      ['fit']
    ],
    modelAnswer: 'BLANK1: StandardScaler, BLANK2: rbf, BLANK3: 5 (or 3), BLANK4: fit',
    explanation: 'StandardScaler is essential for SVM — unscaled features distort the margin. The prefix svm__ in param_grid addresses the Pipeline step named \'svm\'. GridSearchCV.fit() searches all C×gamma combinations using 5-fold CV.',
  },

  // =====================================================================
  // CATEGORY: Random Forest  (Q44-Q47)
  // =====================================================================
  {
    id: 44,
    type: 'short',
    category: 'Random Forest',
    source: { lecture: 'Lecture 17: Random Forest', topic: 'Bagging & Variance Reduction' },
    prompt: 'Explain bagging (Bootstrap Aggregating) and describe how it reduces the variance compared to a single decision tree. What is the key insight from a bias-variance perspective?',
    keywords: {
      required: ['bagging', 'bootstrap', 'replacement', 'aggregation', 'variance', 'reduce'],
      optional: ['majority vote', 'average', 'ensemble', 'independent', 'correlation', 'sampling', 'trees', 'parallel'],
      synonyms: {
        'bootstrap': ['bootstrap sampling', 'with replacement'],
        'aggregation': ['aggregating', 'aggregate'],
        'variance': ['high variance', 'variance reduction'],
      },
      minOptional: 2
    },
    modelAnswer: 'Bagging (Bootstrap Aggregating) trains B base learners (usually deep decision trees) independently, each on a bootstrap sample drawn with replacement from the training data. Predictions are aggregated by majority vote (classification) or averaging (regression). Deep decision trees have low bias but high variance — they fit the training data well but are sensitive to data variations. Averaging B trees reduces variance: if each tree has variance σ² and the trees were independent, the average has variance σ²/B. In practice, trees are correlated (ρ), so variance = ρσ² + (1-ρ)σ²/B, which still decreases with B.',
    explanation: 'Each bootstrap dataset contains ~63.2% unique samples. The remaining ~36.8% (out-of-bag samples) can be used for free validation (OOB error).',
  },

  {
    id: 45,
    type: 'blank',
    category: 'Random Forest',
    source: { lecture: 'Lecture 17: Random Forest', topic: 'RF Algorithm & OOB' },
    prompt: 'Fill in the blanks about Random Forest and out-of-bag error.',
    text: 'Random Forest = ___BLANK1___ + random feature selection at every split. At each split, only a random subset of ___BLANK2___ features (out of M total) are considered. The default for classification is m = ___BLANK3___. This random feature selection ___BLANK4___ the trees, further reducing variance. About ___BLANK5___% of the original training samples are excluded from each bootstrap dataset; these out-of-bag (OOB) samples provide a free, built-in validation estimate.',
    blanks: [
      ['Bagging', 'bagging'],
      ['m', 'm features'],
      ['sqrt(M)', '√M', 'square root of M'],
      ['decorrelates', 'de-correlates', 'makes less correlated'],
      ['36.8', '37', '36']
    ],
    modelAnswer: 'BLANK1: Bagging, BLANK2: m, BLANK3: sqrt(M), BLANK4: decorrelates, BLANK5: 36.8',
    explanation: 'RF formula: variance = ρσ² + (1-ρ)σ²/B. Decorrelating trees (smaller ρ) is more impactful than just increasing B. OOB error ≈ cross-validation error without extra computation.',
  },

  {
    id: 46,
    type: 'ox',
    category: 'Random Forest',
    source: { lecture: 'Lecture 17: Random Forest', topic: 'Random Forest Concepts' },
    prompt: 'Determine whether each statement about Random Forest is True or False.',
    subs: [
      {
        statement: 'Random Forest reduces variance by decorrelating individual trees through random feature selection at each split.',
        answer: true,
        explanation: 'Correct. By forcing each split to consider only m randomly chosen features, different trees focus on different subsets of features, reducing correlation between trees (ρ). Lower ρ directly reduces the ensemble variance: ρσ² + (1-ρ)σ²/B.'
      },
      {
        statement: 'Adding more trees (larger B) to a Random Forest always increases the risk of overfitting.',
        answer: false,
        explanation: 'False. More trees in Random Forest reduce variance and stabilize predictions. RF does not overfit by adding more trees — the ensemble error converges (but does not worsen). This is unlike, say, a single deep decision tree.'
      },
      {
        statement: 'Feature importance in Random Forest can be measured by Mean Decrease in Impurity (MDI) or permutation importance.',
        answer: true,
        explanation: 'Correct. MDI: records the weighted impurity reduction each time a feature is used in a split, averaged across all trees. Permutation importance: randomly shuffles one feature\'s values in OOB data and measures the drop in accuracy — larger drop = more important feature.'
      },
      {
        statement: 'Random Forest requires feature scaling (e.g., StandardScaler) for good performance, similar to KNN and SVM.',
        answer: false,
        explanation: 'False. Random Forest is a tree-based method. Decision trees split based on feature thresholds, not distances or regularization norms. Feature scaling has no effect on tree-based methods and is not required for Random Forest.'
      },
      {
        statement: 'Out-of-bag (OOB) error in Random Forest serves as a built-in validation estimate that is conceptually similar to cross-validation.',
        answer: true,
        explanation: 'Correct. For each training sample xₙ, collect predictions only from trees that did NOT include xₙ in their bootstrap sample (OOB trees). Aggregating these OOB predictions and comparing to true labels gives the OOB error — a free, approximately unbiased estimate of generalization error.'
      }
    ],
  },

  {
    id: 47,
    type: 'code-blank',
    category: 'Random Forest',
    source: { lecture: 'Lecture 17 & Practice 19', topic: 'sklearn RandomForestClassifier' },
    prompt: 'Fill in the blanks to train a Random Forest classifier with OOB scoring enabled.',
    code: `from sklearn.ensemble import RandomForestClassifier

rf = RandomForestClassifier(
    n_estimators=___BLANK1___,    # Number of trees in the forest
    max_features='___BLANK2___',  # Features to consider at each split (classification default)
    oob_score=True,               # Enable out-of-bag error estimation
    random_state=2026
)

rf.___BLANK3___(X_train, y_train)

print("Training accuracy:", round(rf.score(X_train, y_train), 4))
print("OOB score        :", round(rf.oob_score_, 4))
print("Test accuracy    :", round(rf.score(___BLANK4___, y_test), 4))`,
    blanks: [
      ['100', '200', '500'],
      ['sqrt'],
      ['fit'],
      ['X_test']
    ],
    modelAnswer: 'BLANK1: 100 or 200, BLANK2: sqrt, BLANK3: fit, BLANK4: X_test',
    explanation: 'n_estimators=100–200 is a good default. max_features=\'sqrt\' means √M features per split. oob_score_ is only available after fit() when oob_score=True.',
  },

  // =====================================================================
  // CATEGORY: PCA  (Q48-Q50)
  // =====================================================================
  {
    id: 48,
    type: 'short',
    category: 'PCA',
    source: { lecture: 'Lecture 18: Principal Component Analysis', topic: 'Curse of Dimensionality & PCA' },
    prompt: 'Explain the curse of dimensionality. Then describe how Principal Component Analysis (PCA) addresses this problem and what the principal components represent mathematically.',
    keywords: {
      required: ['curse of dimensionality', 'pca', 'variance', 'dimensionality reduction'],
      optional: ['samples grow exponentially', 'distance', 'eigenvectors', 'covariance matrix', 'principal components', 'projection', 'high dimensional'],
      synonyms: {
        'curse of dimensionality': ['curse of dimensionality problem', 'dimensionality curse'],
        'pca': ['principal component analysis'],
        'eigenvectors': ['eigenvector', 'eigen vectors'],
        'covariance matrix': ['covariance', 'sample covariance'],
      },
      minOptional: 2
    },
    modelAnswer: 'The curse of dimensionality: as the number of dimensions D grows, the data becomes increasingly sparse (the number of samples needed to fill the space grows exponentially); distances between all pairs of points become nearly equal (distance-based methods lose discrimination power); and models tend to overfit when D is large relative to N. PCA addresses this by projecting high-dimensional data onto a lower-dimensional subspace while preserving maximum variance. The principal components are orthogonal directions in feature space that maximize the variance of projected data. Mathematically, they are the eigenvectors of the sample covariance matrix S, sorted by decreasing eigenvalue.',
    explanation: 'PCA algorithm: (1) center data, (2) compute S = (1/N)Σ(x_n-x̄)(x_n-x̄)^T, (3) compute eigenvectors u₁,...,u_D of S, (4) keep top M eigenvectors, (5) project: z_n = W^T(x_n - x̄).',
  },

  {
    id: 49,
    type: 'blank',
    category: 'PCA',
    source: { lecture: 'Lecture 18 & 19', topic: 'PCA: Eigenvectors, Explained Variance, Scree Plot' },
    prompt: 'Fill in the blanks about PCA and explained variance.',
    text: 'PCA finds directions that maximize the ___BLANK1___ of the projected data. These directions (principal components) are the ___BLANK2___ of the sample covariance matrix S, sorted by decreasing ___BLANK3___. The fraction of total variance captured by the i-th component is the ___BLANK4___ ratio. A ___BLANK5___ plot graphs these ratios vs. component index; we look for an "elbow" to choose the number of components M. A common rule of thumb is to keep enough components to explain ___BLANK6___% of the total variance.',
    blanks: [
      ['variance'],
      ['eigenvectors'],
      ['eigenvalue', 'eigenvalues'],
      ['explained variance', 'EVR', 'explained variance ratio'],
      ['scree'],
      ['90', '90-95', '95']
    ],
    modelAnswer: 'BLANK1: variance, BLANK2: eigenvectors, BLANK3: eigenvalue, BLANK4: explained variance, BLANK5: scree, BLANK6: 90 or 95',
    explanation: 'Explained variance ratio for component i: λᵢ / Σⱼλⱼ. Cumulative EVR gives the fraction of information retained. Always standardize before PCA when features have different units.',
  },

  {
    id: 50,
    type: 'code-explain',
    category: 'PCA',
    source: { lecture: 'Lecture 18 & 19: PCA in Classification Pipelines', topic: 'Data Leakage with PCA' },
    prompt: 'The following PCA preprocessing code has a data leakage problem. Explain what went wrong and describe the correct approach.',
    code: `from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
from sklearn.model_selection import train_test_split

# A student preprocesses ALL data before the train-test split
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)      # fit on ENTIRE dataset!

pca = PCA(n_components=3)
X_pca = pca.fit_transform(X_scaled)    # transform ALL data!

# Split is done AFTER preprocessing
X_train, X_test, y_train, y_test = train_test_split(
    X_pca, y, test_size=0.3, random_state=2026
)`,
    keywords: {
      required: ['data leakage', 'fit', 'all data', 'test set', 'training data'],
      optional: ['pipeline', 'scaler', 'pca', 'fit_transform', 'training fold', 'cross-validation', 'overly optimistic', 'before'],
      synonyms: {
        'data leakage': ['leakage', 'data leak', 'information leakage'],
        'all data': ['entire dataset', 'full dataset', 'all samples'],
        'training data': ['training set', 'training fold'],
      },
      minOptional: 2
    },
    modelAnswer: 'Problem: Both StandardScaler and PCA are fit on the entire dataset X before the train-test split. The test set\'s mean, variance, and variance directions all influence the scaler\'s parameters and PCA\'s eigenvectors. This is data leakage — the test set inadvertently shapes the preprocessing, causing overly optimistic evaluation (the test set is no longer truly held-out). Correct approach: (1) split data first, (2) build a Pipeline([(\'scaler\', StandardScaler()), (\'pca\', PCA(n_components=3)), (\'clf\', classifier)]) and call pipe.fit(X_train, y_train). Inside cross-validation, wrap the pipeline in GridSearchCV so all preprocessing is refitted on each training fold.',
    explanation: 'Data leakage: any information from the test set/validation fold that enters the training process corrupts the evaluation. Pipeline + GridSearchCV is the standard safeguard.',
  },
];
