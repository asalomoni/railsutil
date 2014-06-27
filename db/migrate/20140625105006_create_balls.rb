class CreateBalls < ActiveRecord::Migration
  def change
    create_table :balls do |t|
      t.string :ball_type
      t.string :ball_size
      t.string :ball_weight

      t.timestamps
    end
  end
end
