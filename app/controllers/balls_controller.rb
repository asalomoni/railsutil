class BallsController < ApplicationController
  before_action :set_ball, only: [:show, :edit, :update, :destroy]

  # GET /balls
  # GET /balls.json
  def index
    @balls = Ball.all
    @balls = @balls.paginate(:page => params[:page], :per_page => 5)
  end

  # GET /balls/1
  # GET /balls/1.json
  def show
  end

  # GET /balls/new
  def new
    @ball = Ball.new
  end

  # GET /balls/1/edit
  def edit
  end

  # POST /balls
  # POST /balls.json
  def create
    @ball = Ball.new(ball_params)

    respond_to do |format|
      if @ball.save
        format.html { redirect_to @ball, notice: 'Ball was successfully created.' }
        format.json { render :show, status: :created, location: @ball }
      else
        format.html { render :new }
        format.json { render json: @ball.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /balls/1
  # PATCH/PUT /balls/1.json
  def update
    respond_to do |format|
      if @ball.update(ball_params)
        format.html { redirect_to @ball, notice: 'Ball was successfully updated.' }
        format.json { render :show, status: :ok, location: @ball }
      else
        format.html { render :edit }
        format.json { render json: @ball.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /balls/1
  # DELETE /balls/1.json
  def destroy
    @ball.destroy
    respond_to do |format|
      format.html { redirect_to balls_url, notice: 'Ball was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  def ball_types
    @balls = Ball.all
    options = @balls.map { |b| { label: b.ball_type, value: b.id } }

    puts options
    render json: options
  end

  def ajax_call
    sleep(4)
    @balls = Ball.all
    @balls = @balls.paginate(:page => params[:page], :per_page => 5)

    respond_to do |format|
      format.html
      format.js
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_ball
      @ball = Ball.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def ball_params
      params.require(:ball).permit(:ball_type, :ball_size, :ball_weight)
    end
end
