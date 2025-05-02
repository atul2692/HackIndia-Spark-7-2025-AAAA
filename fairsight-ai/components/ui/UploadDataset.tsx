'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PDFReport from './PDFReport';

const API_BASE_URL = 'http://localhost:8000/api';

export default function UploadDataset() {
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [analysisInProgress, setAnalysisInProgress] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [protectedAttribute, setProtectedAttribute] = useState('gender');
  const [outcomeAttribute, setOutcomeAttribute] = useState('approved');
  
  // New states for progress tracking
  const [analysisStep, setAnalysisStep] = useState(0);
  const [progressPercentage, setProgressPercentage] = useState(0);
  // New state for managing multiple attribute analysis
  const [selectedProtectedAttribute, setSelectedProtectedAttribute] = useState('gender');
  // State for tracking the reweighted dataset
  const [reweightedDataset, setReweightedDataset] = useState<string | null>(null);

  // Updated states for new animation
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [analysisAnimationStep, setAnalysisAnimationStep] = useState(0);
  const [animationComplete, setAnimationComplete] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      if (!name) {
        // Set the file name as the default name
        setName(e.target.files[0].name.replace('.csv', ''));
      }
    }
  };

  // Reset analysis states when starting a new analysis
  const resetAnalysis = () => {
    setAnalysisResult(null);
    setAnalysisStep(0);
    setProgressPercentage(0);
    setError('');
    setReweightedDataset(null);
    setAnalysisAnimationStep(0);
    setShowAnalysisModal(false);
    setAnimationComplete(false);
  };

  // New animation sequence function
  const runAnalysisAnimation = () => {
    // Show the modal
    setShowAnalysisModal(true);
    setAnimationComplete(false);
    
    // Step 1: Understanding the dataset (2 seconds)
    setAnalysisAnimationStep(1);
    
    // Step 2: Running AIF360 algorithms (3 seconds)
    setTimeout(() => {
      setAnalysisAnimationStep(2);
    }, 2000);
    
    // Step 3: Creating reweighted dataset (2 seconds)
    setTimeout(() => {
      setAnalysisAnimationStep(3);
    }, 5000);
    
    // Step 4: Generating analysis (2 seconds)
    setTimeout(() => {
      setAnalysisAnimationStep(4);
    }, 7000);
    
    // Complete animation
    setTimeout(() => {
      setAnimationComplete(true);
      // Hide modal after a short delay
      setTimeout(() => {
        setShowAnalysisModal(false);
      }, 1000);
    }, 9000);
    
    // Total animation duration: 10 seconds
    return 10000;
  };

  // Replace the simulateAnalysisProgress function
  const simulateAnalysisProgress = () => {
    // Start the new animation
    const animationDuration = runAnalysisAnimation();
    
    // Return a dummy interval that will be cleared later
    const dummyInterval = setInterval(() => {}, 10000);
    return dummyInterval;
  };

  const uploadDataset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    setIsUploading(true);
    resetAnalysis();
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', name);
    formData.append('description', description);

    try {
      const response = await fetch(`${API_BASE_URL}/datasets/upload/`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const data = await response.json();
      setUploadResult(data);
      
      // Automatically run analysis if upload was successful
      if (data.id) {
        runAnalysis(data.id);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during upload');
    } finally {
      setIsUploading(false);
    }
  };

  const runAnalysis = async (datasetId: number) => {
    setAnalysisInProgress(true);
    resetAnalysis();
    
    // Start the progress animation
    const progressInterval = simulateAnalysisProgress();
    
    const analysisData = {
      dataset_id: datasetId,
      name: `Analysis - ${name}`,
      description: `Fairness analysis for ${name}`,
      protected_attribute: selectedProtectedAttribute,
      outcome_attribute: outcomeAttribute
    };

    try {
      const response = await fetch(`${API_BASE_URL}/analyses/analyze/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(analysisData),
      });

      if (!response.ok) {
        throw new Error(`Analysis failed: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Ensure the progress bar gets to 100% before showing results
      // by adding a small delay
      setTimeout(() => {
        clearInterval(progressInterval);
        setProgressPercentage(100);
        setAnalysisStep(5); // Complete
        
        setTimeout(() => {
          setAnalysisResult(data);
          setAnalysisInProgress(false);
        }, 500);
      }, 1000);
      
    } catch (err: any) {
      clearInterval(progressInterval);
      setError(err.message || 'An error occurred during analysis');
      setAnalysisInProgress(false);
    }
  };

  // Update the runDirectAnalysis function to handle the new animation
  const runDirectAnalysis = async (e: React.FormEvent, protectedAttr: string = selectedProtectedAttribute) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    setAnalysisInProgress(true);
    resetAnalysis();
    setSelectedProtectedAttribute(protectedAttr);
    setReweightedDataset(null);
    
    // Start the new analysis animation
    const progressInterval = simulateAnalysisProgress();
    
    try {
      // First read the file to preprocess if needed for age or income
      const fileReader = new FileReader();
      
      fileReader.onload = async (event) => {
        const csvData = event.target?.result as string;
        let originalData = csvData; // Store original data for reweighting
        
        // Create FormData for request
        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('protected_attribute', protectedAttr);
        formData.append('outcome_attribute', outcomeAttribute);
        
        // If age or income analysis, we need to preprocess the file first
        if (protectedAttr === 'age' || protectedAttr === 'income') {
          // Parse the CSV data
          const lines = csvData.split('\n');
          const headers = lines[0].split(',');
          
          // Find the index of the protected attribute column
          const attrIndex = headers.findIndex(h => h.trim().toLowerCase() === protectedAttr);
          
          if (attrIndex !== -1) {
            // Transform the CSV data by binarizing the age or income attribute
            const transformedLines = lines.map((line, i) => {
              if (i === 0) return line; // Keep header row unchanged
              
              const values = line.split(',');
              if (values.length <= attrIndex) return line; // Skip malformed lines
              
              const attrValue = parseFloat(values[attrIndex]);
              if (!isNaN(attrValue)) {
                // Binarize the attribute based on threshold
                // Age: values ≥30 are privileged (1), otherwise unprivileged (0)
                // Income: values ≥50000 are privileged (1), otherwise unprivileged (0)
                const threshold = protectedAttr === 'age' ? 30 : 50000;
                values[attrIndex] = attrValue >= threshold ? '1' : '0';
              }
              
              return values.join(',');
            });
            
            // Create a new file with the transformed data
            const transformedCsv = transformedLines.join('\n');
            const transformedFile = new File([transformedCsv], `preprocessed_${file.name}`, { type: 'text/csv' });
            
            // Add the transformed file to the form data
            formData.append('file', transformedFile);
          } else {
            // If column not found, use original file and show a warning
            formData.append('file', file);
            console.warn(`Column ${protectedAttr} not found in CSV, using original file.`);
          }
        } else {
          // For gender analysis, use the original file
          formData.append('file', file);
        }
        
        // Send the request with the appropriate file
        const response = await fetch(`${API_BASE_URL}/analyses/analyze/`, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Analysis failed: ${response.statusText}`);
        }

        const data = await response.json();
        
        // Generate reweighted dataset based on the results
        if (data.report_data?.metrics) {
          try {
            // Generate reweighted dataset
            generateReweightedDataset(originalData, data, protectedAttr);
          } catch (err) {
            console.error("Error generating reweighted dataset:", err);
          }
        }
        
        // Wait for the animation to complete
        setTimeout(() => {
          clearInterval(progressInterval);
          setAnalysisResult(data);
          setAnalysisInProgress(false);
        }, 10000); // This should match the total animation duration
      };
      
      fileReader.onerror = () => {
        clearInterval(progressInterval);
        setShowAnalysisModal(false);
        throw new Error('Error reading the file');
      };
      
      // Start reading the file
      fileReader.readAsText(file);
      
    } catch (err: any) {
      clearInterval(progressInterval);
      setShowAnalysisModal(false);
      setError(err.message || 'An error occurred during analysis');
      setAnalysisInProgress(false);
    }
  };

  // Function to generate a reweighted dataset
  const generateReweightedDataset = (originalData: string, result: any, protectedAttr: string) => {
    try {
      // Parse the CSV data
      const lines = originalData.split('\n');
      if (lines.length <= 1) throw new Error("Invalid CSV data");
      
      const headers = lines[0].split(',');
      
      // Find the index of the protected attribute and outcome columns
      const protAttrIndex = headers.findIndex(h => h.trim().toLowerCase() === protectedAttr);
      const outcomeIndex = headers.findIndex(h => h.trim().toLowerCase() === outcomeAttribute);
      
      if (protAttrIndex === -1 || outcomeIndex === -1) {
        throw new Error("Protected attribute or outcome column not found");
      }
      
      // Generate weights based on the reweighting algorithm logic
      // This is a simplified version - in a real implementation you would use the actual
      // reweighting algorithm results from the backend
      const reweightedLines = [
        // Add an instance_weight column to the headers
        [...headers, 'instance_weight'].join(',')
      ];
      
      // Constants for reweighting based on the fairness metrics
      // These would normally come from the analysis results
      const privilegedFavorableWeight = result.bias_detected ? 0.8 : 1.0;
      const privilegedUnfavorableWeight = result.bias_detected ? 1.2 : 1.0;
      const unprivilegedFavorableWeight = result.bias_detected ? 1.2 : 1.0;
      const unprivilegedUnfavorableWeight = result.bias_detected ? 0.8 : 1.0;
      
      // Process each data row
      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue; // Skip empty lines
        
        const values = lines[i].split(',');
        if (values.length <= Math.max(protAttrIndex, outcomeIndex)) continue; // Skip malformed lines
        
        let protectedValue: string | number = values[protAttrIndex].trim();
        const outcomeValue = values[outcomeIndex].trim();
        
        // Determine if this instance is privileged and if it has a favorable outcome
        let isPrivileged = false;
        
        if (protectedAttr === 'gender') {
          isPrivileged = protectedValue.toLowerCase() === 'male';
        } else if (protectedAttr === 'age') {
          const age = parseFloat(protectedValue);
          isPrivileged = !isNaN(age) && age >= 30;
        } else if (protectedAttr === 'income') {
          const income = parseFloat(protectedValue);
          isPrivileged = !isNaN(income) && income >= 50000;
        }
        
        const isFavorable = outcomeValue === '1';
        
        // Assign weight based on privilege and outcome
        let weight = 1.0;
        if (isPrivileged && isFavorable) {
          weight = privilegedFavorableWeight;
        } else if (isPrivileged && !isFavorable) {
          weight = privilegedUnfavorableWeight;
        } else if (!isPrivileged && isFavorable) {
          weight = unprivilegedFavorableWeight;
        } else if (!isPrivileged && !isFavorable) {
          weight = unprivilegedUnfavorableWeight;
        }
        
        // Add the row with the weight
        reweightedLines.push([...values, weight.toFixed(4)].join(','));
      }
      
      // Store the reweighted dataset
      setReweightedDataset(reweightedLines.join('\n'));
      
    } catch (error) {
      console.error("Error generating reweighted dataset:", error);
      setReweightedDataset(null);
    }
  };

  // Function to download the reweighted dataset
  const downloadReweightedDataset = () => {
    if (!reweightedDataset) {
      setError('No reweighted dataset available');
      return;
    }
    
    try {
      // Create a blob with the CSV data
      const blob = new Blob([reweightedDataset], { type: 'text/csv' });
      
      // Create a URL for the blob
      const url = URL.createObjectURL(blob);
      
      // Create a temporary link element and trigger the download
      const link = document.createElement('a');
      link.href = url;
      link.download = `reweighted_${selectedProtectedAttribute}_${file?.name || 'dataset.csv'}`;
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading dataset:", error);
      setError('Failed to download reweighted dataset');
    }
  };

  // Get step label based on current step
  const getStepLabel = () => {
    switch (analysisStep) {
      case 1: return 'Processing dataset...';
      case 2: return 'Encoding features...';
      case 3: return 'Calculating fairness metrics...';
      case 4: return 'Applying mitigation strategies...';
      case 5: return 'Analysis complete';
      default: return 'Preparing analysis...';
    }
  };

  // Get attribute-specific interpretation of results
  const getAttributeSpecificInfo = () => {
    if (!analysisResult) return null;

    const metrics = analysisResult.report_data?.metrics;
    if (!metrics) return null;

    switch (selectedProtectedAttribute) {
      case 'gender':
        return {
          title: "Gender Fairness Analysis",
          description: "Analysis of bias between male and female groups",
          privilegedGroup: "Male",
          unprivilegedGroup: "Female",
          interpretation: analysisResult.bias_detected 
            ? "There appears to be gender bias in the outcomes. The model treats males and females differently."
            : "No significant gender bias detected in the outcomes."
        };
      case 'age':
        return {
          title: "Age Fairness Analysis",
          description: "Analysis of bias between age groups (threshold: 30 years)",
          privilegedGroup: "Age ≥ 30",
          unprivilegedGroup: "Age < 30",
          interpretation: analysisResult.bias_detected 
            ? "There appears to be age-based bias in the outcomes. Younger and older individuals are treated differently."
            : "No significant age-based bias detected in the outcomes."
        };
      case 'income':
        return {
          title: "Income Fairness Analysis",
          description: "Analysis of bias between income levels (threshold: $50,000)",
          privilegedGroup: "Income ≥ $50,000",
          unprivilegedGroup: "Income < $50,000",
          interpretation: analysisResult.bias_detected 
            ? "There appears to be income-based bias in the outcomes. Lower and higher income individuals are treated differently."
            : "No significant income-based bias detected in the outcomes."
        };
      default:
        return {
          title: "Fairness Analysis",
          description: "Analysis of bias in outcomes",
          privilegedGroup: "Privileged group",
          unprivilegedGroup: "Unprivileged group",
          interpretation: "See detailed metrics for more information."
        };
    }
  };

  // Get animation step label
  const getAnimationStepLabel = () => {
    switch (analysisAnimationStep) {
      case 1: return 'Understanding the dataset...';
      case 2: return 'Running AIF360 algorithms...';
      case 3: return 'Creating reweighted dataset...';
      case 4: return 'Generating analysis...';
      default: return 'Preparing analysis...';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-900 border border-gray-800 p-6 rounded-xl"
    >
      {/* New Analysis Animation Modal */}
      <AnimatePresence>
        {showAnalysisModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="bg-gray-900 border border-indigo-900/50 rounded-xl p-8 max-w-md w-full mx-4 shadow-xl"
            >
              <div className="flex flex-col items-center">
                {/* Animation step icon */}
                <div className="relative w-24 h-24 mb-6">
                  {analysisAnimationStep === 1 && (
                    <motion.div
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 1.5, opacity: 0 }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <div className="bg-indigo-600/20 p-5 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                    </motion.div>
                  )}
                  
                  {analysisAnimationStep === 2 && (
                    <motion.div
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 1.5, opacity: 0 }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <div className="bg-purple-600/20 p-5 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                        </svg>
                      </div>
                    </motion.div>
                  )}
                  
                  {analysisAnimationStep === 3 && (
                    <motion.div
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 1.5, opacity: 0 }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <div className="bg-blue-600/20 p-5 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2 1 3 3 3h10c2 0 3-1 3-3V7c0-2-1-3-3-3H7C5 4 4 5 4 7z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.7 8h.6c.8 0 1.3.4 1.3 1s-.5 1-1.3 1h-.6v-2z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 13.5V16" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 13.5a1.5 1.5 0 00-3 0v.5" />
                        </svg>
                      </div>
                    </motion.div>
                  )}
                  
                  {analysisAnimationStep === 4 && (
                    <motion.div
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 1.5, opacity: 0 }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <div className="bg-green-600/20 p-5 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                    </motion.div>
                  )}
                  
                  {animationComplete && (
                    <motion.div
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ 
                        scale: 1, 
                        opacity: 1, 
                        rotate: 0 
                      }}
                      transition={{ 
                        type: 'spring', 
                        duration: 0.5 
                      }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <div className="bg-green-600/20 p-5 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </motion.div>
                  )}
                </div>
                
                {/* Animation step text */}
                <motion.h3 
                  key={analysisAnimationStep}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xl font-medium text-white mb-3 text-center"
                >
                  {animationComplete 
                    ? 'Analysis Complete!' 
                    : getAnimationStepLabel()}
                </motion.h3>
                
                <motion.p
                  key={`desc-${analysisAnimationStep}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-gray-400 text-center mb-4"
                >
                  {animationComplete 
                    ? 'Your results are ready to view.' 
                    : `Analyzing ${selectedProtectedAttribute} fairness in your dataset...`}
                </motion.p>
                
                {/* Animated progress bar */}
                {!animationComplete && (
                  <div className="w-full bg-gray-800 rounded-full h-2 mb-6">
                    <motion.div
                      initial={{ width: '0%' }}
                      animate={{ 
                        width: analysisAnimationStep === 1 ? '25%' : 
                               analysisAnimationStep === 2 ? '50%' : 
                               analysisAnimationStep === 3 ? '75%' : '90%' 
                      }}
                      transition={{ duration: 0.5 }}
                      className="bg-indigo-600 h-2 rounded-full"
                    />
                  </div>
                )}
                
                {/* Animated dots */}
                {!animationComplete && (
                  <div className="flex space-x-2 justify-center">
                    <motion.div
                      animate={{ 
                        scale: [1, 1.5, 1],
                        opacity: [0.5, 1, 0.5]
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        repeatType: 'loop',
                        delay: 0
                      }}
                      className="h-2 w-2 bg-indigo-400 rounded-full"
                    />
                    <motion.div
                      animate={{ 
                        scale: [1, 1.5, 1],
                        opacity: [0.5, 1, 0.5]
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        repeatType: 'loop',
                        delay: 0.2
                      }}
                      className="h-2 w-2 bg-indigo-400 rounded-full"
                    />
                    <motion.div
                      animate={{ 
                        scale: [1, 1.5, 1],
                        opacity: [0.5, 1, 0.5]
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        repeatType: 'loop',
                        delay: 0.4
                      }}
                      className="h-2 w-2 bg-indigo-400 rounded-full"
                    />
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <h3 className="text-lg font-semibold mb-4 text-white">Upload Dataset for Fairness Analysis</h3>
      
      {error && (
        <div className="bg-red-900/30 border border-red-700 text-red-300 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}
      
      <form onSubmit={uploadDataset} className="space-y-4">
        <div>
          <label className="block text-gray-300 mb-2">Dataset Name</label>
          <input
            type="text"
            className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter dataset name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        
        <div>
          <label className="block text-gray-300 mb-2">Description (optional)</label>
          <textarea
            className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter dataset description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </div>
        
        <div>
          <label className="block text-gray-300 mb-2">Dataset File (CSV)</label>
          <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 cursor-pointer hover:border-indigo-500 transition-colors" onClick={() => document.getElementById('file-upload')?.click()}>
            <input
              id="file-upload"
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleFileChange}
            />
            <div className="text-center">
              {file ? (
                <div>
                  <p className="text-indigo-400">{file.name}</p>
                  <p className="text-gray-400 text-sm mt-1">
                    {(file.size / 1024).toFixed(2)} KB · Click to change
                  </p>
                </div>
              ) : (
                <div>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-gray-400 mt-2">Drag and drop or click to upload</p>
                  <p className="text-gray-500 text-sm mt-1">CSV files only</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-300 mb-2">Outcome Attribute</label>
            <input
              type="text"
              className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Column name (e.g. approved)"
              value={outcomeAttribute}
              onChange={(e) => setOutcomeAttribute(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-gray-300 mb-2">Select Protected Attribute</label>
          <div className="grid grid-cols-3 gap-3">
            <div 
              className={`cursor-pointer p-3 rounded-lg text-center border ${selectedProtectedAttribute === 'gender' ? 'bg-indigo-600/20 border-indigo-500' : 'bg-gray-800 border-gray-700 hover:border-indigo-500/50'}`}
              onClick={() => setSelectedProtectedAttribute('gender')}
            >
              <div className="text-center mb-2">👥</div>
              <div className={`text-sm font-medium ${selectedProtectedAttribute === 'gender' ? 'text-indigo-200' : 'text-gray-400'}`}>
                Gender
              </div>
            </div>
            
            <div 
              className={`cursor-pointer p-3 rounded-lg text-center border ${selectedProtectedAttribute === 'age' ? 'bg-indigo-600/20 border-indigo-500' : 'bg-gray-800 border-gray-700 hover:border-indigo-500/50'}`}
              onClick={() => setSelectedProtectedAttribute('age')}
            >
              <div className="text-center mb-2">⏳</div>
              <div className={`text-sm font-medium ${selectedProtectedAttribute === 'age' ? 'text-indigo-200' : 'text-gray-400'}`}>
                Age
              </div>
            </div>
            
            <div 
              className={`cursor-pointer p-3 rounded-lg text-center border ${selectedProtectedAttribute === 'income' ? 'bg-indigo-600/20 border-indigo-500' : 'bg-gray-800 border-gray-700 hover:border-indigo-500/50'}`}
              onClick={() => setSelectedProtectedAttribute('income')}
            >
              <div className="text-center mb-2">💰</div>
              <div className={`text-sm font-medium ${selectedProtectedAttribute === 'income' ? 'text-indigo-200' : 'text-gray-400'}`}>
                Income
              </div>
            </div>
          </div>
          <p className="text-gray-500 text-xs mt-2">
            Selected attribute will be analyzed for fairness and bias.
            For age, values ≥30 are considered privileged. For income, values ≥50,000 are considered privileged.
          </p>
        </div>
        
        <div className="flex space-x-4">
          <button
            type="submit"
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50"
            disabled={isUploading || !file}
          >
            {isUploading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Uploading...
              </span>
            ) : (
              'Upload & Save'
            )}
          </button>
          
          <button
            type="button"
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50"
            disabled={analysisInProgress || !file}
            onClick={(e) => runDirectAnalysis(e)}
          >
            {analysisInProgress ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing...
              </span>
            ) : (
              'Run Analysis'
            )}
          </button>
        </div>
      </form>
      
      {analysisResult && (
        <div className="mt-8 p-6 bg-gray-800 rounded-xl border border-indigo-800">
          <h4 className="text-lg font-semibold text-white mb-4">
            Analysis Results for {selectedProtectedAttribute.charAt(0).toUpperCase() + selectedProtectedAttribute.slice(1)}
          </h4>
          
          {getAttributeSpecificInfo() && (
            <div className="bg-indigo-900/30 border border-indigo-800 p-4 rounded-lg mb-6">
              <h5 className="text-white font-medium mb-2">{getAttributeSpecificInfo()?.title}</h5>
              <p className="text-gray-300 mb-2">{getAttributeSpecificInfo()?.description}</p>
              <div className="grid grid-cols-2 gap-4 mt-3">
                <div className="bg-indigo-800/30 p-2 rounded">
                  <span className="text-indigo-300 text-sm">Privileged:</span>{" "}
                  <span className="text-white">{getAttributeSpecificInfo()?.privilegedGroup}</span>
                </div>
                <div className="bg-indigo-800/30 p-2 rounded">
                  <span className="text-indigo-300 text-sm">Unprivileged:</span>{" "}
                  <span className="text-white">{getAttributeSpecificInfo()?.unprivilegedGroup}</span>
                </div>
              </div>
              <p className="text-indigo-200 mt-3 font-medium">{getAttributeSpecificInfo()?.interpretation}</p>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-gray-400 text-sm">Fairness Score</p>
              <p className="text-2xl font-bold text-indigo-400">{analysisResult.fairness_score * 100}%</p>
            </div>
            
            <div>
              <p className="text-gray-400 text-sm">Bias Detected</p>
              <p className={`text-2xl font-bold ${analysisResult.bias_detected ? 'text-yellow-500' : 'text-green-500'}`}>
                {analysisResult.bias_detected ? 'Yes' : 'No'}
              </p>
            </div>
          </div>
          
          <div className="mb-6">
            <h5 className="text-white font-medium mb-2">Metrics</h5>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-900 p-3 rounded">
                <p className="text-gray-400 text-sm">Statistical Parity Difference</p>
                <p className="text-xl font-medium text-white">{analysisResult.report_data?.metrics?.statistical_parity_difference}</p>
              </div>
              
              <div className="bg-gray-900 p-3 rounded">
                <p className="text-gray-400 text-sm">Disparate Impact</p>
                <p className="text-xl font-medium text-white">{analysisResult.report_data?.metrics?.disparate_impact}</p>
              </div>
              
              <div className="bg-gray-900 p-3 rounded">
                <p className="text-gray-400 text-sm">SPD After Reweighing</p>
                <p className="text-xl font-medium text-white">{analysisResult.report_data?.metrics?.reweighed_statistical_parity_difference}</p>
              </div>
              
              <div className="bg-gray-900 p-3 rounded">
                <p className="text-gray-400 text-sm">DI After Reweighing</p>
                <p className="text-xl font-medium text-white">{analysisResult.report_data?.metrics?.reweighed_disparate_impact}</p>
              </div>
            </div>
          </div>
          
          <div>
            <h5 className="text-white font-medium mb-2">Insights</h5>
            <ul className="space-y-2">
              {analysisResult.report_data?.insights.map((insight: string, index: number) => (
                <li key={index} className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-400 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-gray-300">{insight}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Add the PDF Report component */}
          <div className="mt-6 pt-6 border-t border-gray-700">
            <h5 className="text-white font-medium mb-3">Generate Professional Report</h5>
            <p className="text-gray-400 text-sm mb-4">
              Download a comprehensive PDF report containing all analysis results and recommendations:
            </p>
            <PDFReport 
              analysisResult={analysisResult} 
              protectedAttribute={selectedProtectedAttribute}
              datasetName={name || 'Dataset'}
            />
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-700">
            <h5 className="text-white font-medium mb-3">Run Additional Analysis</h5>
            <p className="text-gray-400 text-sm mb-4">
              You can analyze the same dataset using different protected attributes:
            </p>
            <div className="flex flex-wrap gap-2">
              {selectedProtectedAttribute !== 'gender' && (
                <button 
                  onClick={(e) => runDirectAnalysis(e, 'gender')}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  disabled={analysisInProgress}
                >
                  Analyze Gender
                </button>
              )}
              {selectedProtectedAttribute !== 'age' && (
                <button 
                  onClick={(e) => runDirectAnalysis(e, 'age')}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  disabled={analysisInProgress}
                >
                  Analyze Age
                </button>
              )}
              {selectedProtectedAttribute !== 'income' && (
                <button 
                  onClick={(e) => runDirectAnalysis(e, 'income')}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  disabled={analysisInProgress}
                >
                  Analyze Income
                </button>
              )}
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-700">
            <h5 className="text-white font-medium mb-3">Download Processed Dataset</h5>
            <p className="text-gray-400 text-sm mb-4">
              Download the reweighted dataset with adjusted instance weights to mitigate bias:
            </p>
            
            <div className="bg-gray-900 p-4 rounded-lg mb-4">
              <div className="flex items-start mb-3">
                <div className="bg-indigo-600/20 p-2 rounded-lg mr-3 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h6 className="text-indigo-300 font-medium text-sm">How Reweighting Works</h6>
                  <p className="text-gray-400 text-xs mt-1">
                    The reweighted dataset contains an additional column called <span className="text-indigo-300 font-mono">instance_weight</span> that 
                    adjusts the importance of each data point to mitigate bias. When used to train a model, these weights help balance
                    the influence of privileged and unprivileged groups, leading to fairer outcomes.
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3 mt-2">
                <div className="bg-gray-800 p-2 rounded text-xs">
                  <span className="text-indigo-300">Privileged & Favorable:</span>
                  <span className="text-gray-300 block mt-1">
                    {selectedProtectedAttribute === 'gender' ? 'Male' : selectedProtectedAttribute === 'age' ? 'Age ≥ 30' : 'Income ≥ $50,000'} 
                    with positive outcome
                  </span>
                  <span className="text-gray-400 block mt-1">
                    Weight {analysisResult?.bias_detected ? '< 1.0' : '= 1.0'} (reduced influence)
                  </span>
                </div>
                
                <div className="bg-gray-800 p-2 rounded text-xs">
                  <span className="text-indigo-300">Unprivileged & Unfavorable:</span>
                  <span className="text-gray-300 block mt-1">
                    {selectedProtectedAttribute === 'gender' ? 'Female' : selectedProtectedAttribute === 'age' ? 'Age < 30' : 'Income < $50,000'} 
                    with negative outcome
                  </span>
                  <span className="text-gray-400 block mt-1">
                    Weight {analysisResult?.bias_detected ? '< 1.0' : '= 1.0'} (reduced influence)
                  </span>
                </div>
                
                <div className="bg-gray-800 p-2 rounded text-xs">
                  <span className="text-indigo-300">Privileged & Unfavorable:</span>
                  <span className="text-gray-300 block mt-1">
                    {selectedProtectedAttribute === 'gender' ? 'Male' : selectedProtectedAttribute === 'age' ? 'Age ≥ 30' : 'Income ≥ $50,000'} 
                    with negative outcome
                  </span>
                  <span className="text-gray-400 block mt-1">
                    Weight {analysisResult?.bias_detected ? '> 1.0' : '= 1.0'} (increased influence)
                  </span>
                </div>
                
                <div className="bg-gray-800 p-2 rounded text-xs">
                  <span className="text-indigo-300">Unprivileged & Favorable:</span>
                  <span className="text-gray-300 block mt-1">
                    {selectedProtectedAttribute === 'gender' ? 'Female' : selectedProtectedAttribute === 'age' ? 'Age < 30' : 'Income < $50,000'} 
                    with positive outcome
                  </span>
                  <span className="text-gray-400 block mt-1">
                    Weight {analysisResult?.bias_detected ? '> 1.0' : '= 1.0'} (increased influence)
                  </span>
                </div>
              </div>
            </div>
            
            <button 
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={downloadReweightedDataset}
              disabled={!reweightedDataset}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              {reweightedDataset ? 'Download Reweighted Dataset' : 'Reweighted Dataset Not Available'}
            </button>
            {!reweightedDataset && analysisResult && (
              <p className="text-yellow-400 text-xs mt-2">
                Note: Reweighted dataset couldn't be generated. This may happen if the analysis did not produce reweighting information.
              </p>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
} 