class CreateFollowJoins < ActiveRecord::Migration[6.0]
  def change
    create_table :follow_joins do |t|
      t.integer :following
      t.integer :followed
      t.timestamps
    end
  end
end
