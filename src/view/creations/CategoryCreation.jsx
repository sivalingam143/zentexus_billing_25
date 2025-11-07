import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { TextInputform } from '../../components/Forms'

const CategoryCreation = () => {
  return (
    <div>
        <Container>
            <Row>
                <Col xs="12">
                    <TextInputform formLabel="Category"/>
                </Col>
            </Row>
        </Container>
    </div>
  )
}

export default CategoryCreation