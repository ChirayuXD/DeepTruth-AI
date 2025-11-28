'use client'
import React, { useState, useRef } from 'react';
import { Shield, CheckCircle, XCircle, FileImage, Clock, Hash, Database, Link, Scan, Fingerprint, ArrowRight } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function BlockchainContentAuth() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  
  // false = Analyze/Register Mode, true = Verify Mode
  const [verifyMode, setVerifyMode] = useState(false); 
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    processFile(file);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    processFile(file);
  };

  const processFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setResult(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const analyzeImage = async () => {
    if (!selectedFile) return;
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    const mockResult = {
      authenticityScore: Math.random() > 0.5 ? 92 : 45,
      isReal: Math.random() > 0.5,
      contentHash: '0x' + Math.random().toString(36).substring(2, 15),
      ipfsCID: 'Qm' + Math.random().toString(36).substring(2, 15).toUpperCase(),
      timestamp: new Date().toISOString(),
      blockNumber: 15482931,
    };
    
    setResult(mockResult);
    setIsAnalyzing(false);
  };

  const verifyContent = async () => {
    if (!selectedFile) return;
    setIsAnalyzing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockVerification = {
      found: Math.random() > 0.3,
      originalUploader: '0x71C...9A23',
      registeredDate: new Date().toISOString(),
      authenticityScore: 98,
      isReal: true,
      blockNumber: 14200100
    };
    
    setResult(mockVerification);
    setIsAnalyzing(false);
  };

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-200 selection:bg-blue-500/30">
      
      {/* Background Gradients */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[100px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/5 bg-slate-900/50 backdrop-blur-md sticky top-0">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600/20 rounded-lg border border-blue-500/30">
              <Shield className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">ContentAuth</h1>
              <p className="text-[10px] uppercase tracking-wider text-blue-400 font-semibold">Blockchain Verification</p>
            </div>
          </div>
          
          <div className="text-sm text-slate-400 hidden md:block">
            <span className="w-2 h-2 rounded-full bg-green-500 inline-block mr-2 animate-pulse"></span>
            Mainnet Active
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-12 max-w-6xl">
        
        {/* Hero Text */}
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            Secure Media <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Provenance</span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Detect deepfakes and secure content ownership using immutable blockchain records and AI forensics.
          </p>
        </div>

        {/* Tab Switcher - FIXED NAVIGATION */}
        <div className="flex justify-center mb-10">
          <div className="bg-slate-900/80 p-1.5 rounded-full border border-white/10 inline-flex relative">
            <button
              onClick={() => { setVerifyMode(false); clearSelection(); }}
              className={`px-8 py-2.5 rounded-full text-sm font-medium transition-all duration-300 relative z-10 ${
                !verifyMode ? 'text-white shadow-lg' : 'text-slate-400 hover:text-white'
              }`}
            >
              Analyze & Register
            </button>
            <button
              onClick={() => { setVerifyMode(true); clearSelection(); }}
              className={`px-8 py-2.5 rounded-full text-sm font-medium transition-all duration-300 relative z-10 ${
                verifyMode ? 'text-white shadow-lg' : 'text-slate-400 hover:text-white'
              }`}
            >
              Verify Authenticity
            </button>
            
            {/* Sliding Background */}
            <div 
              className={`absolute top-1.5 bottom-1.5 rounded-full bg-blue-600 transition-all duration-300 ease-out ${
                verifyMode ? 'left-[50%] w-[calc(50%-6px)]' : 'left-1.5 w-[calc(50%-6px)]'
              }`}
            />
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          
          {/* Left Column: Upload */}
          <div className="group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl opacity-20 group-hover:opacity-40 transition duration-500 blur"></div>
            <div className="relative bg-slate-900/90 backdrop-blur-xl rounded-2xl border border-white/10 p-8 h-full min-h-[500px] flex flex-col">
              
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                  <FileImage className="w-5 h-5 text-blue-400" />
                  {verifyMode ? 'Upload Source' : 'Upload Content'}
                </h3>
                {selectedFile && (
                  <button onClick={clearSelection} className="text-xs text-red-400 hover:text-red-300 transition-colors">
                    Remove File
                  </button>
                )}
              </div>

              {!selectedFile ? (
                <div 
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 border-2 border-dashed border-slate-700 hover:border-blue-500/50 hover:bg-slate-800/50 rounded-xl transition-all cursor-pointer flex flex-col items-center justify-center p-8 text-center group/drop"
                >
                  <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-6 group-hover/drop:scale-110 transition-transform duration-300">
                    <Scan className="w-10 h-10 text-blue-400" />
                  </div>
                  <p className="text-lg font-medium text-white mb-2">Drag image here</p>
                  <p className="text-sm text-slate-400 mb-6">or click to browse local files</p>
                  <div className="text-xs px-3 py-1 rounded-full bg-slate-800 text-slate-500 border border-slate-700">
                    Supports JPG, PNG, WEBP
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col">
                  <div className="relative flex-1 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 mb-6 group/img">
                    <img 
                      src={previewUrl} 
                      alt="Preview" 
                      className="w-full h-full object-contain absolute inset-0"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/20 transition-all" />
                  </div>
                  
                  <button
                    onClick={verifyMode ? verifyContent : analyzeImage}
                    disabled={isAnalyzing}
                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-900/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                  >
                    {isAnalyzing ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Fingerprint className="w-5 h-5" />
                        {verifyMode ? 'Verify On-Chain' : 'Analyze & Register'}
                      </>
                    )}
                  </button>
                </div>
              )}
              
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
            </div>
          </div>

          {/* Right Column: Results - FIXED EMPTY STATE */}
          <div className="relative h-full min-h-[500px]">
            <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-white/10 p-8 h-full flex flex-col">
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <Database className="w-5 h-5 text-indigo-400" />
                Analysis Results
              </h3>

              {!result && !isAnalyzing ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center opacity-40">
                  <div className="w-24 h-24 mb-6 relative">
                    <div className="absolute inset-0 border-2 border-slate-600 rounded-full animate-ping opacity-20"></div>
                    <div className="absolute inset-0 border-2 border-slate-600 rounded-full"></div>
                    <Shield className="w-10 h-10 text-slate-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  </div>
                  <p className="text-slate-300 font-medium">Ready to Analyze</p>
                  <p className="text-sm text-slate-500 mt-2 max-w-xs">
                    Upload an image to begin the {verifyMode ? 'verification' : 'registration'} process.
                  </p>
                </div>
              ) : isAnalyzing ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8">
                  <div className="relative w-32 h-32">
                    <div className="absolute inset-0 border-t-4 border-blue-500 rounded-full animate-spin"></div>
                    <div className="absolute inset-2 border-r-4 border-indigo-500 rounded-full animate-spin reverse"></div>
                    <div className="absolute inset-0 flex items-center justify-center font-mono text-blue-400 text-sm animate-pulse">
                      HASHING
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-white font-medium">Analyzing Content</h4>
                    <p className="text-sm text-slate-500">Checking against decentralized ledger...</p>
                  </div>
                </div>
              ) : (
                <div className="flex-1 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  {/* Score Card */}
                  <div className={`p-6 rounded-xl border-l-4 mb-6 ${
                    result.authenticityScore > 70 
                      ? 'bg-emerald-500/10 border-emerald-500' 
                      : 'bg-rose-500/10 border-rose-500'
                  }`}>
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-slate-300 font-medium">Trust Score</span>
                      {result.authenticityScore > 70 
                        ? <CheckCircle className="text-emerald-500 w-6 h-6" /> 
                        : <XCircle className="text-rose-500 w-6 h-6" />
                      }
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className={`text-4xl font-bold ${
                        result.authenticityScore > 70 ? 'text-emerald-400' : 'text-rose-400'
                      }`}>
                        {result.authenticityScore}%
                      </span>
                      <span className="text-sm text-slate-400">confidence</span>
                    </div>
                  </div>

                  {/* Tech Details */}
                  <div className="space-y-4">
                    <div className="bg-slate-950/50 rounded-lg p-4 border border-white/5">
                      <div className="flex items-center gap-2 text-sm text-slate-400 mb-2">
                        <Link className="w-4 h-4" /> <span>IPFS CID</span>
                      </div>
                      <code className="text-xs text-indigo-300 font-mono break-all bg-indigo-500/10 px-2 py-1 rounded">
                        {result.ipfsCID || 'Qm...NotRegistered'}
                      </code>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-950/50 rounded-lg p-4 border border-white/5">
                        <div className="flex items-center gap-2 text-sm text-slate-400 mb-2">
                          <Clock className="w-4 h-4" /> <span>Timestamp</span>
                        </div>
                        <p className="text-sm text-white">{new Date(result.timestamp || Date.now()).toLocaleDateString()}</p>
                      </div>
                      <div className="bg-slate-950/50 rounded-lg p-4 border border-white/5">
                        <div className="flex items-center gap-2 text-sm text-slate-400 mb-2">
                          <Hash className="w-4 h-4" /> <span>Block</span>
                        </div>
                        <p className="text-sm text-white font-mono">#{result.blockNumber}</p>
                      </div>
                    </div>
                    
                    <button className="w-full mt-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2 group">
                      View on Etherscan
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Features Footer */}
        <div className="mt-20 grid md:grid-cols-3 gap-8 border-t border-white/5 pt-12">
           {[
             { title: 'Immutable', desc: 'Once recorded, data cannot be altered.', icon: Shield },
             { title: 'Decentralized', desc: 'Stored across thousands of IPFS nodes.', icon: Database },
             { title: 'AI Forensic', desc: 'CNN models detect pixel manipulation.', icon: Scan },
           ].map((feature, i) => (
             <div key={i} className="flex gap-4 items-start opacity-70 hover:opacity-100 transition-opacity">
               <div className="p-3 bg-slate-800 rounded-lg">
                 <feature.icon className="w-6 h-6 text-blue-400" />
               </div>
               <div>
                 <h4 className="text-white font-medium mb-1">{feature.title}</h4>
                 <p className="text-sm text-slate-400 leading-relaxed">{feature.desc}</p>
               </div>
             </div>
           ))}
        </div>

      </main>
    </div>
  );
}
