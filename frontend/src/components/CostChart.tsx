import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface CostChartProps {
  subsidyCost: number;
  consumerShare: number;
  projectCost: number;
}

export const CostChart: React.FC<CostChartProps> = ({
  subsidyCost,
  consumerShare,
  projectCost,
}) => {
  const isCommercial = subsidyCost <= 0;
  
  const data = isCommercial
    ? [
        { name: '40% Accelerated Depreciation (Sec 32)', value: projectCost * 0.4, color: '#F59E0B' },
        { name: 'Net Capital Asset Value', value: projectCost * 0.6, color: '#015296' },
      ]
    : [
        { name: 'PM Surya Ghar Subsidy', value: subsidyCost, color: '#3C8EE3' },
        { name: 'Estimated Consumer Share', value: consumerShare, color: '#015296' },
      ];

  const formatINR = (val: number) => {
    return '₹' + Math.round(val).toLocaleString('en-IN');
  };

  const subsidyPercent = projectCost > 0 ? Math.round((subsidyCost / projectCost) * 100) : 0;

  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col items-center">
      <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-2">
        Investment Breakdown
      </h3>

      <div className="w-full h-56 relative flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={90}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: any) => [formatINR(Number(value) || 0), '']}
              contentStyle={{
                backgroundColor: '#0F172A',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '12px',
                border: 'none',
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">Total Cost</span>
          <span className="text-base font-extrabold text-slate-900">{formatINR(projectCost)}</span>
          {subsidyPercent > 0 ? (
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full mt-0.5">
              {subsidyPercent}% Gov Subsidy
            </span>
          ) : (
            <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded-full mt-0.5">
              40% Tax Write-Off
            </span>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="w-full grid grid-cols-2 gap-2 mt-2 pt-3 border-t border-slate-100 text-xs">
        {isCommercial ? (
          <>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-[#F59E0B] shrink-0"></span>
              <div>
                <p className="text-slate-500 text-[11px]">Tax Write-Off (Sec 32)</p>
                <p className="font-bold text-amber-700">~{formatINR(projectCost * 0.4)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-[#015296] shrink-0"></span>
              <div>
                <p className="text-slate-500 text-[11px]">Capital Investment</p>
                <p className="font-bold text-slate-900">{formatINR(consumerShare)}</p>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-[#3C8EE3] shrink-0"></span>
              <div>
                <p className="text-slate-500 text-[11px]">Subsidy</p>
                <p className="font-bold text-slate-900">{formatINR(subsidyCost)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-[#015296] shrink-0"></span>
              <div>
                <p className="text-slate-500 text-[11px]">Your Share</p>
                <p className="font-bold text-slate-900">{formatINR(consumerShare)}</p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

