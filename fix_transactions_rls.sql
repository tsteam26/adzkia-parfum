-- Enable DELETE policy for transactions table
create policy "Users can delete their own transactions"
  on transactions for delete
  using (user_id = auth.uid());

-- Also add UPDATE policy just in case it is needed later
create policy "Users can update their own transactions"
  on transactions for update
  using (user_id = auth.uid());
