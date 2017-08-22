import React from 'react';
import moment from 'moment';

export default class DatePicker extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			day: null,
			month: null,
			year: null,
			selectDay: "day",
			selectMonth: "month",
			selectYear: "year",
		}
	}

	shouldComponentUpdate(_nextProps, nextState) {
    return this.state.selectDay !== nextState.selectDay ||
      this.state.selectMonth !== nextState.selectMonth ||
      this.state.selectYear !== nextState.selectYear
  }

	componentWillMount() {
		const day = ['day'];
    const month = ['month'];
    const year = ['year'];
    const date = new Date();

		for (let i=1; i<=31; i++) {
			day.push(i);
		}
		for (let i=1; i<=12; i++) {
			month.push(i);
		}

		let minYear = 1900;
		let maxYear = date.getFullYear();

		if(this.props.minYear && this.props.maxYear) {
			minYear = this.props.minYear;
			maxYear = this.props.maxYear;
		}

		for (let i=maxYear; i>=minYear; i--) {
			year.push(i);
		}

		this.setState({
			day: day,
			month: month,
			year: year
		});
	}

	changeDate(e, type) {
		this.setState({
			[type]: e.target.value
		});
		this.checkDate(e.target.value, type);
	}

	checkDate(value, type) {
		let { selectDay, selectMonth, selectYear } = this.state;

		if (type === 'selectDay') {
			selectDay = value;
		} else if (type === 'selectMonth') {
			selectMonth = value;
		} else if (type === 'selectYear') {
			selectYear = value;
		}

		if(this.isSelectedAllDropdowns(selectDay, selectMonth, selectYear)){
			this.props.dateChange( moment({ year :selectYear, month :selectMonth - 1, day :selectDay}).format() )
		}
	}

	isSelectedAllDropdowns(selectDay, selectMonth, selectYear) {
		return selectDay !== "day" && selectMonth !== "month" && selectYear !== "year"
	}

	render() {

		const dayElement = this.state.day.map((day, id) => {
      if (id == 0)
        return <option value='' key={ id }>{ day }</option>
			return <option value={ day } key={ id }>{ day }</option>
		})
		const monthElement = this.state.month.map((month, id) => {
      if (id == 0)
        return <option value='' key={ id }>{ month }</option>
			return <option value={ month } key={ id }>{ month }</option>
		})
		const yearElement = this.state.year.map((year, id) => {
      if (id == 0)
        return <option value='' key={ id }>{ year }</option>
			return <option value={ year } key={ id }>{ year }</option>
		})

		return (
			<div>
				<select className='form-control col-sm-3 inline-block'
					value={this.state.selectMonth}
					required='required'
					onChange={(e) => this.changeDate(e, 'selectMonth')}>
					{ monthElement }
				</select>
				<select className='form-control col-sm-3 inline-block'
					value={this.state.selectDay}
					required='required'
					onChange={(e) => this.changeDate(e, 'selectDay')}>
					{ dayElement }
				</select>
				<select className='form-control col-sm-3 inline-block'
					value={this.state.selectYear}
					required='required'
					onChange={(e) => this.changeDate(e, 'selectYear')}>
					{ yearElement }
				</select>
			</div>
		)
	}
}
