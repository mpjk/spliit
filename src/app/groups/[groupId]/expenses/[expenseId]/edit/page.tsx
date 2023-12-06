import { ExpenseForm } from '@/components/expense-form'
import { deleteExpense, getExpense, getGroup, updateExpense } from '@/lib/api'
import { expenseFormSchema } from '@/lib/schemas'
import { notFound, redirect } from 'next/navigation'

export default async function EditExpensePage({
  params: { groupId, expenseId },
}: {
  params: { groupId: string; expenseId: string }
}) {
  const group = await getGroup(groupId)
  if (!group) notFound()
  const expense = await getExpense(groupId, expenseId)
  if (!expense) notFound()

  async function updateExpenseAction(values: unknown) {
    'use server'
    const expenseFormValues = expenseFormSchema.parse(values)
    await updateExpense(groupId, expenseId, expenseFormValues)
    redirect(`/groups/${groupId}`)
  }

  async function deleteExpenseAction() {
    'use server'
    await deleteExpense(expenseId)
    redirect(`/groups/${groupId}`)
  }

  return (
    <ExpenseForm
      group={group}
      expense={expense}
      onSubmit={updateExpenseAction}
      onDelete={deleteExpenseAction}
    />
  )
}
