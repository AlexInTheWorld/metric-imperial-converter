// An interactive imperial and metric units converter build with React, jQuery, CSS and HTML

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      available_units: {
        strs: [",km,mi,ft,m,cm,in,yd,", ",ac,sqm,", ",pt,gal,l,"],
        unit_equivalences: {
          0: {
            km: ["kilometres", 0.001],
            mi: ["miles", 0.00062137],
            ft: ["feet", 3.28084],
            m: ["metres", 1],
            cm: ["centimetres", 1000],
            in: ["inches", 39.37],
            yd: ["yards", 1.0936133],
            type: "Length Conversion" },

          1: {
            ac: ["acres", 0.0002471],
            sqm: ["square metres", 1],
            type: "Area Conversion" },

          2: {
            pt: ["pint", 1.759754],
            gal: ["gallons", 0.21997],
            l: ["litres", 1],
            type: "Volume Conversion" } } },



      heading: "Convert common distance, area and volume units",
      unit_opts: "",
      user_input: "",
      user_units: "",
      user_amount: "",
      message: "" };

    this.handleClick = this.handleClick.bind(this);
    this.handleUserInput = this.handleUserInput.bind(this);
    this.handleOptions = this.handleOptions.bind(this);
  }

  handleUserInput() {
    let user_input = $("#input").val().trim();
    let amount, input_units;
    let unit_opts = "";
    let message = this.state.message;

    if (user_input !== this.state.user_input) {
      message = "Enter a valid amount (w/ units)"; // message won't change unless amount and units have both the correct format
      if (user_input.length > 0) {
        input_units = user_input.match(/\d\s*\D+$/i); // Continue verifying input_units and amount if user typed a string containing a digit+string pattern at the end. In other case, input_units would keep holding a falsy value.

        if (input_units) {
          input_units = input_units.toString().substring(1); // Get rid of the first digit to obtain user units string
          amount = user_input.replace(input_units, "").trim(); // Get the amount by getting rid of the user units previously calculated from the user input
          input_units = input_units.trim().toLowerCase(); // Standarize input_units

          let unit = "," + input_units + ",";
          let regex = new RegExp(unit);
          // Search for defined unit pattern stored in component's state
          for (let i = 0; i < this.state.available_units.strs.length; i++) {
            if (
            regex.test(this.state.available_units.strs[i]) &&
            /^\d*[.]?\d+$/.test(amount))
            {
              unit_opts = this.state.available_units.strs[i];
              message = "";
              break;
            }
          }
          if (!unit_opts) {
            input_units = "";
          }
        }
      }
    } else {
      return [
      this.state.user_input,
      this.state.user_amount,
      this.state.user_units,
      this.state.message,
      this.state.unit_opts];

    }

    return [user_input, amount, input_units, message, unit_opts];
  }

  handleOptions() {
    var user_data_arr = this.handleUserInput();
    this.setState({
      unit_opts: user_data_arr[4] || "",
      user_amount: user_data_arr[1],
      message: user_data_arr[3],
      user_input: user_data_arr[0],
      user_units: user_data_arr[2],
      heading:
      user_data_arr[1] && user_data_arr[2] && user_data_arr[4] ?
      this.state.available_units.unit_equivalences[
      this.state.available_units.strs.indexOf(user_data_arr[4])].
      type :
      this.state.heading //Set heading to text corresponding to the type of conversion being carried out
    });
  }

  handleClick() {
    var [
    user_input,
    amount,
    input_units,
    message,
    unit_opts] =
    this.handleUserInput();

    var result;

    if (amount && input_units) {
      let user_amount = Number(amount.replace(/^0+/, ""));
      let output_units = $("#desired_output").val();
      if (output_units) {
        // Check if user units are in the current set of possible units (unit_opts)
        if (unit_opts.search("," + output_units + ",") >= 0) {
          let key = this.state.available_units.strs.indexOf(unit_opts);
          let num_result =
          user_amount *
          this.state.available_units.unit_equivalences[key][
          output_units][
          1] /
          this.state.available_units.unit_equivalences[key][input_units][1];
          if (output_units == input_units) {
            num_result = user_amount;
          }
          let result =
          user_amount +
          " " +
          this.state.available_units.unit_equivalences[key][input_units][0] +
          " equal " +
          num_result +
          " " +
          this.state.available_units.unit_equivalences[key][output_units][0];

          message = result;
        } else {
          message = "Incompatible units";
        }
      } else {
        message = "Select output units";
      }
    }

    this.setState({
      message: message });

  }

  render() {
    let unit_options = this.state.unit_opts.
    split(",").
    filter((item, i) => item); //Get array of available output units
    let opt_el = []; // Options elements to be embedded into select element
    for (let i = 0; i < unit_options.length; i++) {
      if (unit_options[i] == this.state.user_units) {
        continue;
      }
      opt_el.push( /*#__PURE__*/
      React.createElement("option", { value: unit_options[i], key: i.toString() },
      unit_options[i]));


    }

    return /*#__PURE__*/(
      React.createElement("div", { className: "app-container" }, /*#__PURE__*/
      React.createElement("h1", null, "Imperial Converter"), /*#__PURE__*/
      React.createElement("h3", null, this.state.heading), /*#__PURE__*/
      React.createElement("div", { id: "data-container" }, /*#__PURE__*/
      React.createElement("div", { id: "user-input" }, /*#__PURE__*/
      React.createElement("div", { className: "user_options" }, /*#__PURE__*/
      React.createElement("label", { htmlFor: "input" }, "Enter amount:\u2003"), /*#__PURE__*/
      React.createElement("input", {
        name: "amount",
        id: "input",
        type: "text",
        maxLength: "25",
        placeholder: "amount w/ units",
        required: true })), /*#__PURE__*/


      React.createElement("div", { className: "user_options" }, /*#__PURE__*/
      React.createElement("label", { htmlFor: "desired_output" }, "Convert to:\u2003"), /*#__PURE__*/
      React.createElement("select", {
        name: "desired_output",
        id: "desired_output",
        onClick: this.handleOptions },

      opt_el))), /*#__PURE__*/



      React.createElement("button", { type: "text", id: "submit-btn", onClick: this.handleClick }, "Submit Query!")), /*#__PURE__*/



      React.createElement("p", { id: "outcome" }, this.state.message)));


  }}


ReactDOM.render( /*#__PURE__*/React.createElement(App, null), document.getElementById("app"));