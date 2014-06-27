json.array!(@balls) do |ball|
  json.extract! ball, :id, :ball_type, :ball_size, :ball_weight
  json.url ball_url(ball, format: :json)
end
