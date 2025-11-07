import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { TextInputform } from '../../components/Forms'

const GroupCreation = () => {
  return (
    <div>
        <Container>
            <Row>
                <Col xs='12'>
                    <TextInputform formLabel="Group Name"/>
                </Col>
            </Row>
        </Container>
    </div>
  )
}

export default GroupCreation