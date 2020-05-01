import React from 'react'
import PropTypes from 'prop-types'
import Moment from 'react-moment'
import moment from 'moment'

const ProfileEducation = ({
    education: {school, degree, fieldofstudy, current, to, from, description}
}) => (
    <h3 className='text-dark'>{school}</h3>
    <p>
        <Moment format='YYYY/MM/DD'>{moment.utc(from)}</Moment>
    </p>
    <p>
        <strong>Degree: </strong> {degree}
    </p>
    <p>
    <strong>Field Of Study: </strong> {fieldofstudy}
</p>
<p>
        <strong>Description: </strong> {description}
    </p>
)

ProfileEducation.proptypes = {
    education: PropTypes.object.isRequired
}

export default ProfileEducation;