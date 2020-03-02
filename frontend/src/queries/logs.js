import gql from 'graphql-tag';

const ALL_LOGS = gql`
    query allLogs ($week: Int, $status: String) {
      allLogs(week: $week, status: $status) {
        id
        task
        description
        start
        end
        status
      }
    }
`;

export default {
  ALL_LOGS
}