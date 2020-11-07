class FixFkeysFollowJoinsTable < ActiveRecord::Migration[6.0]
  def change

    add_column :follow_joins, :following_id, :integer
    add_column :follow_joins, :followed_id, :integer
    remove_column :follow_joins, :followed, :integer
    remove_column :follow_joins, :following, :integer
  end
end
