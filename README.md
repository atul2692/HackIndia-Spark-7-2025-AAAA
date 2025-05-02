# FairSight: AI Fairness Visualization Platform

An interactive web platform for analyzing and mitigating bias in machine learning models using the AI Fairness 360 toolkit.

## Project Overview

FairSight integrates the AI Fairness 360 (AIF360) toolkit into a web application, allowing users to:
- Upload datasets and ML models
- Analyze fairness metrics across protected attributes
- Apply bias mitigation algorithms
- Visualize fairness comparisons before and after mitigation

## Project Structure

- `fairsight_backend/` - Django backend with AIF360 integration
- `fairsight-ai/` - Next.js frontend for visualizing fairness metrics and bias mitigation

## Features

- Upload and analyze CSV datasets
- Select protected attributes and outcome variables
- Calculate comprehensive fairness metrics
- Apply various bias mitigation algorithms
- Visualize before/after metrics with interactive charts
- Export transformed datasets

## Technology Stack

- **Backend**: Django, REST API, AIF360
- **Frontend**: Next.js, React, TypeScript, Chart.js
- **Data**: pandas, scikit-learn

## Setup Instructions

See the READMEs in each directory for detailed setup instructions.

## License

MIT 