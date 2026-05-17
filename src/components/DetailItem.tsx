export default function DetailItem({label,value}:{label:string,value:string}) {
    return (
        <div className="detail-item">
            <div className="detail-label">{label}</div>
            <div className="detail-value">{value}</div>
        </div>
    );
}