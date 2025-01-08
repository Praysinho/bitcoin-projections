'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useState, useMemo, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, Cell } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DollarSign, Percent } from "lucide-react";

interface Scenario {
  name: string;
  price: number;
  probability: number;
  timeframe: string;
  risk: string;
  barColor: string;
  gradientStart: string;
  gradientEnd: string;
  currentStatus: string;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  selectedMetric: string;
}

const CustomTooltip = ({ active, payload, label, selectedMetric }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const value = payload[0].value;
    return (
      <div className="bg-slate-900/95 backdrop-blur-sm p-4 sm:p-6 rounded-xl shadow-xl border border-slate-600/50">
        <p className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-4">
          {selectedMetric === 'price'
            ? formatCurrency(value)
            : `${value}%`
          }
        </p>
        <div className="space-y-1 sm:space-y-2">
          <p className="text-xs sm:text-sm text-white font-medium">
            Timeframe: {data.timeframe}
          </p>
          <p className="text-xs sm:text-sm font-medium" style={{ color: getRiskColor(data.risk) }}>
            Riesgo: {data.risk}
          </p>
        </div>
      </div>
    );
  }
  return null;
};

const getRiskColor = (risk: string) => {
  const colors: { [key: string]: string } = {
    'Bajo': '#93c5fd',
    'Medio': '#818cf8',
    'Alto': '#c4b5fd',
    'Muy Alto': '#e9d5ff'
  };
  return colors[risk] || '#94a3b8';
};

const getStatusStyle = (status: string) => {
  switch (status) {
    case 'Superado':
      return 'text-emerald-300 bg-emerald-950/50 border border-emerald-700/50 shadow-sm shadow-emerald-900/20';
    case 'En curso':
      return 'text-blue-300 bg-blue-950/50 border border-blue-700/50 shadow-sm shadow-blue-900/20';
    case 'Pendiente':
      return 'text-slate-300 bg-slate-800/50 border border-slate-700/50';
    default:
      return 'text-slate-300 bg-slate-800/50';
  }
};

const BitcoinProjections = () => {
  const [selectedMetric, setSelectedMetric] = useState<'price' | 'probability'>('price');
  const [currentPrice, setCurrentPrice] = useState(97027);
  const [ath, setAth] = useState(108200);

  const fetchBitcoinPrice = async () => {
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true');
      const data = await response.json();
      setCurrentPrice(Math.round(data.bitcoin.usd));
    } catch (error) {
      console.error('Error fetching Bitcoin price:', error);
    }
  };

  useEffect(() => {
    fetchBitcoinPrice();
    const interval = setInterval(fetchBitcoinPrice, 60000);
    return () => clearInterval(interval);
  }, []);
  
  const scenarios = useMemo<Scenario[]>(() => [
    {
      name: 'Conservador',
      price: 130000,
      probability: 30,
      timeframe: 'Q4 2024',
      risk: 'Bajo',
      barColor: '#93c5fd',
      gradientStart: '#3b82f6',
      gradientEnd: '#60a5fa',
      currentStatus: 'Superado'
    },
    {
      name: 'Base',
      price: 227500,
      probability: 45,
      timeframe: 'Q1 2025',
      risk: 'Medio',
      barColor: '#818cf8',
      gradientStart: '#4f46e5',
      gradientEnd: '#6366f1',
      currentStatus: 'En curso'
    },
    {
      name: 'Optimista',
      price: 325000,
      probability: 20,
      timeframe: 'Q2 2025',
      risk: 'Alto',
      barColor: '#c4b5fd',
      gradientStart: '#7c3aed',
      gradientEnd: '#8b5cf6',
      currentStatus: 'Pendiente'
    },
    {
      name: 'Moon',
      price: 520000,
      probability: 5,
      timeframe: 'Q3 2025',
      risk: 'Muy Alto',
      barColor: '#e9d5ff',
      gradientStart: '#9333ea',
      gradientEnd: '#a855f7',
      currentStatus: 'Pendiente'
    }
  ], []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 p-2 sm:p-4 md:p-6">
      <Card className="bg-slate-900/90 backdrop-blur-sm border-none text-white shadow-lg">
        <CardHeader className="border-b border-slate-700/30 space-y-4 sm:space-y-6 pb-4 sm:pb-6">
          <CardTitle className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent text-center pb-2 sm:pb-4">
            Proyecciones de Bitcoin Post-Halving
          </CardTitle>
          <div className="font-mono text-base sm:text-lg text-white text-center">
            Precio Actual: {formatCurrency(currentPrice)} | ATH: {formatCurrency(ath)}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6 sm:space-y-8 py-4 sm:py-6">
            <div className="flex flex-wrap gap-3 sm:gap-4 justify-center">
              {[
                {
                  metric: 'price' as const,
                  label: 'Precio Objetivo',
                  icon: DollarSign
                },
                {
                  metric: 'probability' as const,
                  label: 'Probabilidad',
                  icon: Percent
                }
              ].map(({ metric, label, icon: Icon }) => (
                <button
                  key={metric}
                  className={`
                    flex items-center space-x-2 px-4 sm:px-8 py-2 sm:py-3 rounded-full text-sm sm:text-base
                    transition-all duration-300 hover:shadow-lg
                    ${selectedMetric === metric
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                      : 'bg-slate-800/80 text-white hover:bg-slate-700/80'
                    }
                  `}
                  onClick={() => setSelectedMetric(metric)}
                >
                  <Icon size={18} />
                  <span>{label}</span>
                </button>
              ))}
            </div>
            
            <div className="h-[400px] sm:h-[500px] lg:h-[550px] bg-slate-900/90 backdrop-blur-sm rounded-xl p-2 sm:p-4 relative">
              <ResponsiveContainer width="100%" height="100%" minHeight={400}>
                <BarChart
                  data={scenarios}
                  margin={{ top: 40, right: 20, left: 40, bottom: 20 }}
                  barGap={12}
                  barSize={70}
                >
                  <defs>
                    {scenarios.map((entry, index) => (
                      <linearGradient
                        key={`gradient-${index}`}
                        id={`barGradient-${index}`}
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor={entry.gradientStart}
                          stopOpacity={1}
                        />
                        <stop
                          offset="100%"
                          stopColor={entry.gradientEnd}
                          stopOpacity={0.8}
                        />
                      </linearGradient>
                    ))}
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis 
                    dataKey="name" 
                    stroke="#e2e8f0"
                    tick={{ fill: '#e2e8f0', fontSize: 12 }}
                  />
                  <YAxis 
                    stroke="#e2e8f0"
                    width={60}
                    label={{ 
                      value: selectedMetric === 'price' ? 'Precio USD' : 'Probabilidad %',
                      angle: -90,
                      position: 'insideLeft',
                      offset: 10,
                      style: { fill: '#e2e8f0', fontSize: 12 }
                    }}
                    tickFormatter={(value) => selectedMetric === 'price' 
                      ? `${Math.round(value / 1000)}K`
                      : `${value}%`
                    }
                    domain={[
                      selectedMetric === 'price' 
                        ? Math.floor(currentPrice * 0.7 / 1000) * 1000
                        : 0,
                      selectedMetric === 'price'
                        ? Math.ceil(scenarios[scenarios.length - 1].price * 1.1 / 1000) * 1000
                        : 50
                    ]}
                    tick={{ fill: '#e2e8f0', fontSize: 12 }}
                  />
                  <Tooltip 
                    content={(props) => <CustomTooltip {...props} selectedMetric={selectedMetric} />}
                  />
                  <Legend 
                    content={() => (
                      <div className="flex justify-center items-center mt-2">
                        <span className="text-white text-sm sm:text-lg">
                          {selectedMetric === 'price' ? 'Precio Objetivo USD' : 'Probabilidad %'}
                        </span>
                      </div>
                    )}
                    verticalAlign="top"
                    height={50}
                  />
                  {selectedMetric === 'price' && (
                    <ReferenceLine
                      y={currentPrice}
                      stroke="#22c55e"
                      strokeWidth={2}
                      strokeDasharray="3 3"
                      label={{ 
                        value: `Precio Actual: ${formatCurrency(currentPrice)}`,
                        position: 'insideBottomLeft',
                        fill: '#22c55e',
                        fontSize: 12,
                        dy: -15
                      }}
                      isFront={true}
                    />
                  )}
                  <Bar
                    dataKey={selectedMetric}
                    name={selectedMetric === 'price' ? 'Precio Objetivo USD' : 'Probabilidad %'}
                    radius={[8, 8, 0, 0]}
                  >
                    {scenarios.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={`url(#barGradient-${index})`}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {scenarios.map((scenario) => (
                <Card 
                  key={scenario.name}
                  className="relative bg-slate-900/90 backdrop-blur-sm border-none shadow-md hover:shadow-lg transition-all duration-300 rounded-xl overflow-hidden"
                >
                  <div className="absolute inset-0 opacity-10" style={{
                    background: `linear-gradient(to bottom, ${scenario.gradientStart}, ${scenario.gradientEnd})`
                  }} />
                  <div className="relative p-4 sm:p-8 space-y-4 sm:space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-700/30 pb-4">
                      <h3 className="text-lg sm:text-xl font-semibold text-white">
                        {scenario.name}
                      </h3>
                      <span className={`
                        px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm
                        ${getStatusStyle(scenario.currentStatus)}
                      `}>
                        {scenario.currentStatus}
                      </span>
                    </div>
                    <div className="space-y-3 sm:space-y-4">
                      <p className="font-mono text-xl sm:text-2xl font-bold text-white">
                        {formatCurrency(scenario.price)}
                      </p>
                      <div className="space-y-1 sm:space-y-2 text-sm sm:text-base text-white">
                        <p>Probabilidad: {scenario.probability}%</p>
                        <p>Timeframe: {scenario.timeframe}</p>
                        <p>Riesgo: <span style={{color: getRiskColor(scenario.risk)}}>{scenario.risk}</span></p>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BitcoinProjections;