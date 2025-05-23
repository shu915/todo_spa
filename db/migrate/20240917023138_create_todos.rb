class CreateTodos < ActiveRecord::Migration[7.1]
  def change
    create_table :todos do |t|
      t.string :name, null: false
      t.boolean :is_completed, null: false, default: false

      t.timestamps
    end
  end
end
