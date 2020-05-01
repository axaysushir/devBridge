import React, {Fragment} from 'react'
import PropTypes from 'prop-types'

const ProfileAbout = ({
    profile: {bio, skills, user: {name}}
}) => (
    <div className="profile-about ng-light p-2">
        {bio && (
            <Fragment>
                <h2 className='text-primary'>{name.trim().split(' ')[0]}s Bio</h2>
                <p>{bio}</p>
                <div className='line' />
            </Fragment>
        )}
        <h2 className="text-primary">Skill set</h2>
        <div className="skills">
            {skills.map((skill, index) => (
                <div className="p-1" key={index}>
                    <i className="fas fa-check" /> {skill}
                </div>
            ))}
        </div>
    </div>
)

ProfileAbout.propTypes = {
    profile: PropTypes.object.isRequired
}

export default ProfileAbout;