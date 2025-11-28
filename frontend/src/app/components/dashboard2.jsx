'use client';

import React, { useState, useRef } from 'react';
import {
  Shield, CheckCircle, FileImage,
  Database, Wallet, Lock,
  Share2, ArrowRight, Server, Cpu, Scan, Fingerprint, Clipboard, Copy
} from 'lucide-react';

/** Helpers **/
const truncateHash = (hash, start = 8, end = 6) => {
  if (!hash) return '';
  if (hash.length <= start + end) return hash;
  return `${hash.substring(0, start)}...${hash.substring(hash.length - end)}`;
};

export default function ContentAuthPro() {
  // single-mode UI (no tabs)
  const [walletAddress, setWalletAddress] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [status, setStatus] = useState('idle'); // idle | processing | complete
  const [pipelineStep, setPipelineStep] = useState(0);
  const [verificationResults, setVerificationResults] = useState(null);

  const [copied, setCopied] = useState(''); // '', 'content', 'ipfs', 'tx', 'all'
  const fileInputRef = useRef(null);

  const connectWallet = () => setWalletAddress('0x71C...9A23');

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setStatus('idle');
      setPipelineStep(0);
      setVerificationResults(null);
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setStatus('idle');
    setPipelineStep(0);
    setVerificationResults(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Backend call (Flask)
  const sendToBackend = async () => {
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const resp = await fetch('http://127.0.0.1:5000/analyze', {
        method: 'POST',
        body: formData,
      });
      if (!resp.ok) {
        const errText = await resp.text().catch(() => null);
        throw new Error(`Backend returned ${resp.status} ${errText ?? ''}`);
      }
      const data = await resp.json();

      setVerificationResults({
        score: Number(data.authenticityScore),
        isReal: !!data.isAuthentic,
        contentHash: data.contentHash,
        ipfsCid: data.ipfsHash,
        txHash: data.transactionHash,
        timestamp: new Date().toISOString(),
      });
      setStatus('complete');
    } catch (err) {
      console.error('sendToBackend error', err);
      setStatus('idle');
      // keep UI simple — you can add a toast/alert if you want
    }
  };

  // Pipeline visual + actual network call at the end
  const processContent = async () => {
    if (!selectedFile) return;
    setStatus('processing');

    setPipelineStep(1);
    await new Promise(r => setTimeout(r, 700));

    setPipelineStep(2);
    await new Promise(r => setTimeout(r, 900));

    setPipelineStep(3);
    await new Promise(r => setTimeout(r, 700));

    setPipelineStep(4);
    await sendToBackend();
  };

  // copy helpers
  const writeClipboard = async (text, key) => {
    try {
      await navigator.clipboard.writeText(text || '');
      setCopied(key);
      setTimeout(() => setCopied(''), 1500);
    } catch (e) {
      console.error('clipboard failed', e);
    }
  };

  const openEtherscan = (tx) => {
    if (!tx) return;
    // default to etherscan mainnet
    const url = `https://sepolia.etherscan.io/tx/${tx}`;
    window.open(url, '_blank', 'noopener');
  };

  const openIpfs = (cid) => {
    if (!cid) return;
    const url = `https://ipfs.io/ipfs/${cid}`;
    window.open(url, '_blank', 'noopener');
  };

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-200 selection:bg-blue-500/30 font-sans">
      {/* Background subtle */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[100px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/5 bg-slate-900/50 backdrop-blur-md sticky top-0">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-blue-500" />
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">TrustChain</h1>
              <p className="text-[10px] uppercase tracking-wider text-blue-400 font-semibold">
                AI Based Blockchain Verification
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 container mx-auto px-4 py-4 max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Left: Upload / Preview */}
          <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 flex flex-col h-full">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <FileImage className="w-5 h-5 text-blue-400" />
              Verify Content
            </h3>

            {!selectedFile ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 border-2 border-dashed border-slate-700 hover:border-blue-500/50 hover:bg-slate-800/50 rounded-xl transition cursor-pointer flex flex-col items-center justify-center p-8 text-center"
              >
                <Scan className="w-16 h-16 text-blue-400 mb-4" />
                <p className="text-lg font-medium">Drag image here</p>
                <p className="text-sm text-slate-400 mt-2">or click to browse local files</p>
                <div className="text-xs px-3 py-1 rounded-full bg-slate-800 text-slate-500 border border-slate-700 mt-4">
                  Supports JPG, PNG, WEBP
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col">
                <div className="relative flex-1 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 mb-6">
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-contain absolute inset-0" />
                </div>

                {status === 'idle' && (
                  <div className="space-y-3">
                    <button
                      onClick={processContent}
                      disabled={false}
                      className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <Fingerprint className="w-5 h-5" />
                      Analyze & Register
                    </button>

                    <button onClick={clearSelection} className="w-full py-3 text-slate-400 hover:text-white">
                      Cancel Selection
                    </button>
                  </div>
                )}

                {status === 'processing' && (
                  <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                    <div className="relative w-32 h-32">
                      <div className="absolute inset-0 border-t-4 border-blue-500 rounded-full animate-spin"></div>
                      <div className="absolute inset-2 border-r-4 border-indigo-500 rounded-full animate-spin reverse"></div>
                      <div className="absolute inset-0 flex items-center justify-center font-mono text-blue-400 text-sm animate-pulse">
                        PROCESS
                      </div>
                    </div>
                    <div className="w-full max-w-xs text-center text-sm text-slate-400">
                      Running AI forensic checks and registering the content on-chain.
                    </div>
                  </div>
                )}
              </div>
            )}

            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
          </div>

          {/* Right: Results */}
          <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8 min-h-[520px] flex flex-col">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <Database className="w-5 h-5 text-indigo-400" />
              Analysis Results
            </h3>

            {/* Empty */}
            {status === 'idle' && (
              <div className="flex-1 flex flex-col items-center justify-center text-center opacity-40">
                <Shield className="w-16 h-16 text-slate-400 mb-4" />
                <p className="text-slate-300 font-medium">Ready to Analyze</p>
                <p className="text-sm text-slate-500 mt-2 max-w-xs">Upload an image and click "Analyze & Register".</p>
              </div>
            )}

            {/* Processing pipeline */}
            {status === 'processing' && (
              <div className="flex-1 flex flex-col justify-center gap-6">
                {[
                  { id: 1, title: 'SHA-256 Hashing', icon: Lock },
                  { id: 2, title: 'AI Forensic Analysis', icon: Cpu },
                  { id: 3, title: 'IPFS Upload', icon: Server },
                  { id: 4, title: 'Blockchain Registry', icon: Database }
                ].map(step => (
                  <div key={step.id} className={`flex items-center gap-4 ${pipelineStep >= step.id ? 'opacity-100' : 'opacity-40'}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${
                      pipelineStep > step.id ? 'bg-green-500/20 border-green-500 text-green-400' :
                      pipelineStep === step.id ? 'bg-blue-500/20 border-blue-500 text-blue-400 animate-pulse' :
                      'bg-slate-800 border-slate-700 text-slate-500'
                    }`}>
                      <step.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm text-white">{step.title}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Final results */}
            {status === 'complete' && verificationResults && (
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  {/* Smaller authenticity score card */}
                  {/* DYNAMIC COLOR BASED ON REAL/FAKE */}
<div
  className={`p-4 rounded-xl border mb-4 flex items-center justify-between transition-all duration-300
    ${
      verificationResults.isReal
        ? "bg-emerald-500/10 border-emerald-500/40"
        : "bg-red-500/10 border-red-500/40"
    }
  `}
>
  <div>
    <div
      className={`text-sm font-medium ${
        verificationResults.isReal ? "text-emerald-200" : "text-red-200"
      }`}
    >
      Authenticity Score
    </div>

    <div
      className={`text-2xl font-bold leading-none ${
        verificationResults.isReal ? "text-emerald-400" : "text-red-400"
      }`}
    >
      {(verificationResults.score).toFixed(4)}%
    </div>
  </div>

  <div className="flex items-center gap-3">
    <CheckCircle
      className={`w-6 h-6 ${
        verificationResults.isReal ? "text-emerald-400" : "text-red-400"
      }`}
    />
    <div
      className={`text-sm ${
        verificationResults.isReal ? "text-emerald-200" : "text-red-200"
      }`}
    >
      {verificationResults.isReal ? "Real" : "Fake"}
    </div>
  </div>
</div>


                  {/* Metadata blocks with copy buttons */}
                  <div className="space-y-3">
                    <div className="p-3 bg-slate-950/40 rounded-lg border border-white/5 flex items-center justify-between">
                      <div>
                        <div className="text-xs text-slate-400 mb-1">Content Hash (SHA-256)</div>
                        <code className="text-indigo-300 font-mono break-all">{truncateHash(verificationResults.contentHash, 12, 12)}</code>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <button
                          onClick={() => writeClipboard(verificationResults.contentHash, 'content')}
                          className="flex items-center gap-2 text-sm px-3 py-1 rounded bg-slate-800/60 hover:bg-slate-800/70"
                        >
                          <Clipboard className="w-4 h-4" />
                          {copied === 'content' ? 'Copied' : 'Copy'}
                        </button>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-950/40 rounded-lg border border-white/5 flex items-center justify-between">
                      <div>
                        <div className="text-xs text-slate-400 mb-1">IPFS CID</div>
                        <code className="text-blue-300 font-mono break-all">{truncateHash(verificationResults.ipfsCid, 12, 12)}</code>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className="flex gap-2">
                          <button
                            onClick={() => writeClipboard(verificationResults.ipfsCid, 'ipfs')}
                            className="flex items-center gap-2 text-sm px-3 py-1 rounded bg-slate-800/60 hover:bg-slate-800/70"
                          >
                            <Clipboard className="w-4 h-4" />
                            {copied === 'ipfs' ? 'Copied' : 'Copy'}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-950/40 rounded-lg border border-white/5 flex items-center justify-between">
                      <div>
                        <div className="text-xs text-slate-400 mb-1">Transaction Hash</div>
                        <code className="text-white font-mono break-all">{truncateHash(verificationResults.txHash, 12, 12)}</code>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className="flex gap-2">
                          <button
                            onClick={() => writeClipboard(verificationResults.txHash, 'tx')}
                            className="flex items-center gap-2 text-sm px-3 py-1 rounded bg-slate-800/60 hover:bg-slate-800/70"
                          >
                            <Clipboard className="w-4 h-4" />
                            {copied === 'tx' ? 'Copied' : 'Copy'}
                          </button>          
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* bottom actions */}
                <div>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => openEtherscan(verificationResults.txHash)}
                      className="w-full py-3 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm flex items-center justify-center gap-2"
                    >
                      View on Etherscan
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => openIpfs(verificationResults.ipfsCid)}
                      className="w-full py-3 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm flex items-center justify-center gap-2"
                    >
                      Open IPFS File
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="mt-3 text-xs text-slate-400">
                    {verificationResults.timestamp ? `Registered: ${new Date(verificationResults.timestamp).toLocaleString()}` : ''}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
