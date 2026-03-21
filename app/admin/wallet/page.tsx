'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownRight, 
  CreditCard, 
  History, 
  Plus, 
  Search, 
  MoreVertical, 
  Trash2, 
  Eye, 
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Zap,
  DollarSign,
  TrendingUp,
  Activity,
  Filter,
  Download
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const transactions = [
  { id: '1', description: 'Platform Payout #2841', amount: -2450.00, status: 'Completed', date: 'Mar 18, 2024', type: 'Payout' },
  { id: '2', description: 'Monthly Subscription Revenue', amount: 12400.50, status: 'Completed', date: 'Mar 15, 2024', type: 'Revenue' },
  { id: '3', description: 'Ad Network Distribution', amount: 3200.00, status: 'Pending', date: 'Mar 20, 2024', type: 'Revenue' },
  { id: '4', description: 'Server Maintenance Fee', amount: -150.00, status: 'Completed', date: 'Mar 10, 2024', type: 'Expense' },
  { id: '5', description: 'Platform Payout #2840', amount: -1200.00, status: 'Failed', date: 'Mar 05, 2024', type: 'Payout' },
]

export default function AdminWalletPage() {
  const [loading, setLoading] = useState(false)

  return (
    <div className="space-y-8 pb-20">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-10 rounded-[3rem] shadow-sm border border-border/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-5">
          <Wallet className="h-40 w-40 rotate-12" />
        </div>
        <div className="relative z-10">
          <Badge className="mb-4 bg-primary/10 text-primary border-none font-black px-4 py-1.5 rounded-full uppercase tracking-widest text-[10px]">
            Financial Control
          </Badge>
          <h1 className="text-4xl font-black tracking-tight text-slate-900">Platform Wallet</h1>
          <p className="text-slate-500 mt-2 font-bold max-w-lg">Manage platform funds, bank connections, and payout configurations.</p>
        </div>
        <div className="flex items-center gap-3 relative z-10">
          <Button variant="outline" className="rounded-2xl h-14 px-6 font-black border-2 hover:bg-slate-50 transition-all">
            <CreditCard className="mr-2 h-5 w-5" /> Bank Accounts
          </Button>
          <Button className="rounded-2xl h-14 px-8 font-black bg-primary shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all">
            <Plus className="mr-2 h-5 w-5" /> Deposit Funds
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Balance Card */}
        <div className="xl:col-span-1 space-y-8">
          <Card className="rounded-[3rem] border-none shadow-xl bg-slate-900 text-white p-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-10">
              <Zap className="h-20 w-20 rotate-12" />
            </div>
            <p className="text-white/50 font-black text-xs uppercase tracking-[0.2em] mb-4">Total Balance</p>
            <h2 className="text-5xl font-black tracking-tighter mb-8">$142,890.50</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 p-4 rounded-2xl">
                <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-1">Available</p>
                <p className="font-black text-lg">$128k</p>
              </div>
              <div className="bg-white/5 p-4 rounded-2xl">
                <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-1">Pending</p>
                <p className="font-black text-lg">$14k</p>
              </div>
            </div>
            <Button className="w-full mt-8 h-14 rounded-2xl font-black bg-white text-slate-900 hover:bg-white/90 transition-all">
              Withdraw Funds <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Card>

          <Card className="rounded-[3rem] border-none shadow-xl bg-white p-10">
            <h3 className="text-xl font-black text-slate-900 mb-6">Payment Methods</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 group cursor-pointer hover:border-primary/20 transition-all">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-3" />
                  </div>
                  <div>
                    <p className="font-black text-sm text-slate-900">Visa ending in 4242</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Expires 12/26</p>
                  </div>
                </div>
                <Badge className="bg-primary/10 text-primary border-none font-black text-[9px] px-2 py-0">PRIMARY</Badge>
              </div>
              <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 group cursor-pointer hover:bg-slate-50 transition-all">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-4" />
                  </div>
                  <div>
                    <p className="font-black text-sm text-slate-900">billing@podhub.com</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">PayPal Account</p>
                  </div>
                </div>
                <MoreVertical className="h-4 w-4 text-slate-300 group-hover:text-slate-900 transition-colors" />
              </div>
            </div>
            <Button variant="outline" className="w-full mt-6 h-12 rounded-xl font-black border-2 border-dashed border-slate-200 text-slate-400 hover:text-primary hover:border-primary/20 hover:bg-primary/5 transition-all">
              <Plus className="mr-2 h-4 w-4" /> Add New Method
            </Button>
          </Card>
        </div>

        {/* Transaction History */}
        <Card className="xl:col-span-2 rounded-[3rem] border-none shadow-xl bg-white overflow-hidden flex flex-col">
          <CardHeader className="p-10 border-b border-border/40">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <CardTitle className="text-2xl font-black text-slate-900">Transaction History</CardTitle>
                <CardDescription className="font-bold text-slate-400">Complete record of platform financial movement.</CardDescription>
              </div>
              <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-2xl">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input 
                    placeholder="Search ID, description..." 
                    className="pl-10 h-10 rounded-xl bg-white border-none font-bold text-xs w-[200px]"
                  />
                </div>
                <Button variant="ghost" size="icon" className="rounded-xl h-10 w-10 text-slate-400">
                  <Filter className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-xl h-10 w-10 text-slate-400">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0 flex-1">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="px-10 py-6 font-black text-slate-400 uppercase tracking-widest text-[11px]">Description</th>
                    <th className="font-black text-slate-400 uppercase tracking-widest text-[11px]">Date</th>
                    <th className="font-black text-slate-400 uppercase tracking-widest text-[11px]">Status</th>
                    <th className="px-10 py-6 font-black text-slate-400 uppercase tracking-widest text-[11px] text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-10 py-6">
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            "h-10 w-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-110",
                            tx.amount > 0 ? 'bg-emerald-50 text-emerald-500' : 'bg-rose-50 text-rose-500'
                          )}>
                            {tx.amount > 0 ? <ArrowUpRight className="h-5 w-5" /> : <ArrowDownRight className="h-5 w-5" />}
                          </div>
                          <div>
                            <p className="font-black text-sm text-slate-900 group-hover:text-primary transition-colors">{tx.description}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">#{tx.id}28419</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <p className="text-xs font-black text-slate-500 uppercase tracking-wider">{tx.date}</p>
                      </td>
                      <td>
                        {tx.status === 'Completed' ? (
                          <div className="flex items-center gap-1.5 text-emerald-500 font-black text-[10px] uppercase tracking-widest">
                            <CheckCircle2 className="h-3.5 w-3.5" /> COMPLETED
                          </div>
                        ) : tx.status === 'Pending' ? (
                          <div className="flex items-center gap-1.5 text-amber-500 font-black text-[10px] uppercase tracking-widest">
                            <Clock className="h-3.5 w-3.5" /> PENDING
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-rose-500 font-black text-[10px] uppercase tracking-widest">
                            <ShieldCheck className="h-3.5 w-3.5" /> FAILED
                          </div>
                        )}
                      </td>
                      <td className="px-10 py-6 text-right">
                        <p className={cn(
                          "font-black text-base tracking-tight",
                          tx.amount > 0 ? 'text-emerald-500' : 'text-slate-900'
                        )}>
                          {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                        </p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-10 mt-auto border-t border-slate-50 bg-slate-50/30 flex items-center justify-between">
              <p className="text-xs font-bold text-slate-400">Showing last 5 transactions of 1,284</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="rounded-xl h-10 px-4 font-black border-2 text-xs">Previous</Button>
                <Button variant="outline" size="sm" className="rounded-xl h-10 px-4 font-black border-2 text-xs">Next</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
