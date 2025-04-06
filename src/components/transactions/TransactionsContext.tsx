
import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockTransactions, Transaction, TransactionCategory, TransactionType } from '@/lib/data';
import { toast } from 'sonner';

type TransactionsContextType = {
  transactions: Transaction[];
  addTransaction: (transaction: {
    description: string;
    amount: number;
    category: TransactionCategory;
    type: TransactionType;
  }) => void;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  getTotalSpendingByType: (type: TransactionType) => number;
  getTotalBalance: () => number;
};

const TransactionsContext = createContext<TransactionsContextType | undefined>(undefined);

export const useTransactions = () => {
  const context = useContext(TransactionsContext);
  if (!context) {
    throw new Error('useTransactions must be used within a TransactionsProvider');
  }
  return context;
};

export const TransactionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const savedTransactions = localStorage.getItem('transactions');
    return savedTransactions ? JSON.parse(savedTransactions) : mockTransactions;
  });

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = (transaction: {
    description: string;
    amount: number;
    category: TransactionCategory;
    type: TransactionType;
  }) => {
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      description: transaction.description,
      amount: transaction.amount,
      category: transaction.category,
      type: transaction.type,
      date: new Date().toISOString(),
    };
    
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const updateTransaction = (id: string, updatedTransactionData: Partial<Transaction>) => {
    setTransactions(prev => 
      prev.map(transaction => 
        transaction.id === id ? { ...transaction, ...updatedTransactionData } : transaction
      )
    );
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(transaction => transaction.id !== id));
    toast.success("Transaction deleted successfully");
  };
  
  // Helper functions to calculate spending by type
  const getTotalSpendingByType = (type: TransactionType): number => {
    return transactions
      .filter(tx => tx.type === type && tx.amount < 0)
      .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
  };
  
  // Calculate total balance
  const getTotalBalance = (): number => {
    return transactions.reduce((sum, tx) => sum + tx.amount, 0);
  };

  return (
    <TransactionsContext.Provider value={{ 
      transactions, 
      addTransaction, 
      updateTransaction, 
      deleteTransaction,
      getTotalSpendingByType,
      getTotalBalance
    }}>
      {children}
    </TransactionsContext.Provider>
  );
};
