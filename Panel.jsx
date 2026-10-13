import PropTypes from 'prop-types';

export default function Panel({ title, description, children }) {
  return <section className="panel" aria-label={title}>
    <div className="panel-heading"><h2>{title}</h2>{description && <p>{description}</p>}</div>
    {children}
  </section>;
}

Panel.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  children: PropTypes.node.isRequired,
};
