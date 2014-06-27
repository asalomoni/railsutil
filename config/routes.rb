Rails.application.routes.draw do

  resources :balls do
    collection do
      get 'ball_types'
      get 'ajax_call'
    end
  end

  root 'testing#index'

end
