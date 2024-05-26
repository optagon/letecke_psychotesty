from reading import Result
from flask import Flask, render_template, session, redirect, url_for
from reading import Reading, Combination
import os
from flask_wtf import FlaskForm
from listening import Listening

from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin, login_user, LoginManager, login_required, logout_user, current_user
from wtforms import StringField, PasswordField, SubmitField
from wtforms.validators import InputRequired, Length, ValidationError
from flask_bcrypt import Bcrypt


app = Flask(__name__)
bcrypt = Bcrypt(app)
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///'+os.path.join(basedir, 'database.db')
app.config['SECRET_KEY'] = 'thisissecretkey'
SESSION_TYPE = "redis"
PERMANENT_SESSION_LIFETIME = 1800

db.init_app(app)

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'auth.login'

app.register_blueprint(auth_blueprint)

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

#app.config.update(SECRET_KEY=os.urandom(24))



# Create the User table if it doesn't exist
with app.app_context():
    db.create_all()


@app.route("/", methods=['GET', 'POST'])
@login_required
def index():
    return render_template('pages/index.html')


@app.route("/intro-reading")
@login_required
def intro_reading():
    return render_template("pages/instructions/intro_reading.html")

@app.route("/intro-listening")
@login_required
def intro_listening():
    return render_template("pages/instructions/intro_listening.html")


@app.route("/shortterm-memory-reading")
@login_required
def shortterm_memory_reading():
    list_of_combinations = []
    list_of_results = []
    for i in range(10):
        reading = Reading()
        first_number = reading[0]
        second_number = reading[1]
        first_letter = reading[2]
        second_letter = reading[3]
        result = Result(first_number, second_number, first_letter, second_letter)
        list_of_results.append(result)

        session['key'] = list_of_results
        combination = Combination(first_number, second_number, first_letter, second_letter)
        list_of_combinations.append(combination)


    combinations = {
        'combination': list_of_combinations,
    }
    print(combinations)
    print(type(combinations))

    return render_template('pages/shortterm-memory-reading.html', combinations=combinations)


final_list = []


@app.route("/shortterm-memory-listening")
@login_required
def shortterm_memory_listening():
    final_list = Listening()
    session['listening_key'] = final_list
    print("results: ", final_list[1])
    return render_template('pages/shortterm-memory-listening.html')



@app.route('/results', methods=["POST"])
@login_required
def form():
    if request.method == 'POST':
        user_inputs = request.form.getlist('input')
        sublist_of_results = session.get('key', None)
        list_of_results = []
        for a in sublist_of_results:
            for item in a:
                list_of_results.append(item)

        missing = list(set(list_of_results)-set(user_inputs))
        print("chybne odpovedi: ", missing)
        final_result = (1 - (len(missing)) / 20) * 100
        final_result = round(final_result, 1)

        if final_result >= 80:
            success_msg = "uspěl(a)"
        elif final_result < 80:
            success_msg = "neuspěl(a)"
        else:
            success_msg = "error"

    return render_template("pages/results.html", user_inputs=user_inputs, combinations=list_of_results, final_result=final_result, success_msg=success_msg)

@app.route('/results_listening', methods=["POST"])
@login_required
def results_listening():
    if request.method == 'POST':
        user_inputs = []
        user_inputs = request.form.getlist('input')
        print("uzivatel zadal ", user_inputs)
        list_of_results = session.get('listening_key', None)
        print("spravne odpovedi: ", list_of_results)

        #missing = list(set(list_of_results)-set(user_inputs))
        missing = 5
        print("chybne odpovedi: ", missing)

        final_result = 30
        final_result = round(final_result, 1)

        if final_result >= 80:
            success_msg = "uspěl(a)"
        elif final_result < 80:
            success_msg = "neuspěl(a)"
        else:
            success_msg = "error"

    for i in range(10):
        os.remove("static/sounds/sound"+str(i)+".mp3")

    return render_template("pages/results_listening.html", user_inputs=user_inputs, combinations=list_of_results, final_result=final_result, success_msg=success_msg)


# grid
SYMBOLS = ['*', '#', '$', '&', '@']
GRID_SIZE = 12

def generate_grid():
    """Generate a random grid of symbols."""
    grid = [[random.choice(SYMBOLS) for _ in range(GRID_SIZE)] for _ in range(GRID_SIZE)]
    return grid

def get_symbol_location(grid):
    """Get the location of the symbol displayed to the user."""
    row = random.randint(0, GRID_SIZE - 1)
    col = random.randint(0, GRID_SIZE - 1)
    symbol = grid[row][col]
    return row, col, symbol


@app.route('/photo_memory', methods=['GET', 'POST'])
@login_required
def photographic_memory():
    # Render play template with grid
    return render_template('pages/photographic_memory.html')


#IQ
# TODO this needs to be moved elsewhere
iqs = [
    {"question": " 2, 1, (1/2), (1/4), ...", "answer": "1/8"},
    {"question": " 7, 10, 8, 11, 9, 12, ...", "answer": "10"},
    {"question": " 36, 34, 30, 28, 24, ...", "answer": "22"},
    {"question": " 22, 21, 23, 22, 24, 23, ...", "answer": "25"},
    {"question": " 53, 53, 40, 40, 27, 27, ... ", "answer": "14"},
    {"question": " 21, 9, 21, 11, 21, 13, 21, ...", "answer": "15"},
    {"question": " 58, 52, 46, 40, 34, ...", "answer": "28"},
    {"question": " 3, 4, 7, 8, 11, 12, ...", "answer": "10"},
    {"question": " 8, 22, 8, 28, 8, ...", "answer": "34"},
    {"question": " 31, 29, 24, 22, 17, ... ", "answer": "15"},
    {"question": " 1.5, 2.3, 3.1, 3.9, ...", "answer": "4.7"},
    {"question": " 14, 28, 20, 40, 32, 64, ...", "answer": "56"},
    {"question": " 2, 4, 6, 8, 10, ...  ", "answer": "12"},
    {"question": " 201, 202, 204, 207, ...", "answer": "208"},
    {"question": " 544, 509, 474, 439, ...", "answer": "404"},
    {"question": " 80, 10, 70, 15, 60, ...", "answer": "20"},
    {"question": " 2, 6, 18, 54, ... ", "answer": "162"},
    {"question": " 5.2, 4.8, 4.4, 4, ...", "answer": "3.6"},
    {"question": " 8, 6, 9, 23, 87 , ... ", "answer": "429"}



]

# Global variables to keep track of user's score
correct_answers = 0
incorrect_answers = 0
iq_final_score = 0


@app.route('/iq')
@login_required
def iq():
    return render_template('pages/iq.html')


@app.route("/circles")
@login_required
def circles():
    return render_template("pages/circles.html")

@app.route("/rectangles")
@login_required
def rectangles():
    return render_template("pages/rectangles.html")

@app.route('/math')
@login_required
def math():
    return render_template('pages/math.html')

@app.route('/kombajn')
@login_required
def kombajn():
    return render_template('pages/kombajn.html')

@app.route('/pizza')
@login_required
def pizza():
    return render_template('pages/pizza.html')

@app.route("/about")
@login_required
def about():
    return render_template("pages/about.html")

# intro pages routes
@app.route("/intro_circles")
@login_required
def intro_circles():
    return render_template("pages/instructions/intro_circles.html")

@app.route('/intro_photo_memory')
@login_required
def intro_photographic_memory():
    return render_template('pages/instructions/intro_photo_memory.html')

@app.route('/intro_iq')
@login_required
def intro_iq():
    return render_template('pages/instructions/intro_iq.html')

@app.route('/intro_ctverecky')
@login_required
def intro_ctverecky():
    return render_template('pages/instructions/intro_ctverecky.html')

@app.route('/intro_math')
@login_required
def intro_math():
    return render_template('pages/instructions/intro_math.html')

@app.route('/intro_kombajn')
@login_required
def intro_kombajn():
    return render_template('pages/instructions/intro_kombajn.html')

@app.route('/intro_pizza')
@login_required
def intro_pizza():
    return render_template('pages/instructions/intro_pizza.html')


if __name__ == "__main__":
    app.debug= True
    app.run(host = '0.0.0.0', port = 5000)
