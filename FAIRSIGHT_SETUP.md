# FairSight AI Setup Guide

This guide will help you set up and run both the FairSight AI frontend and backend components.

## Prerequisites

- Node.js (v14+ recommended)
- Python (v3.8+ recommended)
- pip (Python package manager)
- PowerShell (for Windows users)

## Setting Up the Backend

The backend uses Django with a REST API and requires several Python packages for fairness analysis.

### Automated Setup (Windows)

1. Open PowerShell in the project root directory
2. Run the setup script:

```powershell
.\setup_fairsight_backend.ps1
```

3. Start the backend server:

```powershell
cd fairsight_backend
.\venv\Scripts\Activate.ps1
python manage.py runserver
```

### Manual Setup (Any Platform)

1. Navigate to the backend directory:

```bash
cd fairsight_backend
```

2. Create a virtual environment:

```bash
python -m venv venv
```

3. Activate the virtual environment:

- Windows:
```powershell
.\venv\Scripts\Activate.ps1
```

- Linux/macOS:
```bash
source venv/bin/activate
```

4. Install required packages:

```bash
pip install django djangorestframework django-cors-headers pandas numpy scikit-learn aif360
```

5. Apply migrations:

```bash
python manage.py migrate
```

6. Start the backend server:

```bash
python manage.py runserver
```

The backend API will be available at: http://localhost:8000/api/

## Setting Up the Frontend

The frontend is built with Next.js and requires Node.js.

1. Navigate to the frontend directory:

```bash
cd fairsight-ai
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

The frontend will be available at: http://localhost:3000

## Using the Multi-Attribute Fairness Analysis

The demo page now includes the ability to analyze fairness across multiple protected attributes:

1. Go to http://localhost:3000/demo
2. Upload a CSV dataset that includes columns for:
   - `gender` (Male/Female)
   - `age` (numeric)
   - `income` (numeric)
   - `approved` (0/1 for outcome)
3. Select which protected attribute to analyze (gender, age, or income)
4. Click "Run Analysis"
5. Review the fairness metrics and insights
6. Optionally analyze the same dataset with different protected attributes

### How Multi-Attribute Analysis Works

The frontend performs preprocessing for age and income attributes:

- **Gender**: No preprocessing needed - expected values are "Male" and "Female"
- **Age**: Values are automatically binarized with a threshold of 30 years
  - Age ≥ 30 → privileged group (1)
  - Age < 30 → unprivileged group (0)
- **Income**: Values are automatically binarized with a threshold of $50,000
  - Income ≥ $50,000 → privileged group (1)
  - Income < $50,000 → unprivileged group (0)

This preprocessing happens in the frontend before sending data to the backend, ensuring compatibility with the existing fairness analysis API.

## Required Dataset Format

Your dataset should have at least these columns:
- `gender`: Male/Female 
- `age`: numeric
- `income`: numeric
- `approved`: 0/1 (outcome variable, where 1 is the favorable outcome)

Sample format:
```
age,gender,education,income,approved
32,Male,12,50000,1
45,Male,16,75000,1
37,Female,16,70000,0
26,Female,12,45000,0
42,Male,14,65000,1
```

## Troubleshooting

- **Backend connection issues**: Ensure the backend server is running on port 8000
- **CORS errors**: The backend is configured to allow requests from localhost:3000
- **Package installation errors**: Try installing packages individually or check for Python version compatibility
- **Error loading AI fairness packages**: The AIF360 package sometimes has complex dependencies; you may need to install additional system libraries
- **Analysis issues**: Make sure your CSV has the correct column names (`gender`, `age`, `income`, `approved`) with the expected data types

### Troubleshooting Age and Income Analysis

If you're having trouble with age or income analysis:

1. Verify your CSV column names match exactly (`age` and `income`)
2. Check that these columns contain numeric values only
3. If an analysis fails, check the browser console for any preprocessing errors
4. Try the sample dataset provided to verify functionality

The frontend now handles preprocessing for age and income analysis automatically, ensuring that:
- Numerical values are properly binarized based on thresholds
- The backend receives data in the format it expects
- Results are interpreted in the context of the specific attribute being analyzed 