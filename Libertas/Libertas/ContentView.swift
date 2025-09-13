//
//  ContentView.swift
//  Libertas
//
//  Created by Rueshelle Ferguson on 12/09/2025.
//

import SwiftUI

struct ContentView: View {
    var body: some View {
        VStack(spacing: 20) {
            // Header Section
            VStack {
                Text("Financial Overview")
                    .font(.title)
                    .fontWeight(.bold)
                    .foregroundColor(.primary)
            }
            .padding(.top, 20)
            
            // top cards
            VStack(spacing: 16) {
                HStack(spacing: 12) {
                    Card(title: "Total Debt", value: "£12,100", valueColor: .blue)
                    Card(title: "Total Outgoings", value: "£1,079.43", subtitle: "Monthly", valueColor: .red)
                }
                HStack(spacing: 12) {
                    Card(title: "Expenses", value: "£850", subtitle: "Monthly", valueColor: .blue)
                    Card(title: "Debt Payments", value: "£229.43", subtitle: "Monthly", valueColor: .blue)
                }
            }
            
            // Monthly expense
            VStack {
                HStack{
                    Text("Monthly Expense")
                    Spacer()
                    Button("", systemImage: "plus.app.fill") {
                    }
                }
                
                // cards
                HStack (spacing: 20 ){
                    Text("Rent")
                    Text("£400")
                    Text("Due: 9th")
                }
            }
            
            // debts
            HStack {
                VStack {
                    Text("Netflix")
                    Text("Interest Rate: 3%")
                    Text("Minimum Payments: £4.50")
                }
                Spacer()
                
                VStack {
                    Text("Ammount")
                    Text("£300")
                }
            }
            
        }
        .padding()
        Spacer()
    }
}
    
#Preview {
    ContentView()
}


struct Card: View {
    let title: String
    let value: String
    let subtitle: String?
    let valueColor: Color
    
    init(title: String, value: String, subtitle: String? = nil, valueColor: Color = .blue) {
        self.title = title
        self.value = value
        self.subtitle = subtitle
        self.valueColor = valueColor
    }
    
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Spacer()
            Text(title)
                .font(.subheadline)
                .fontWeight(.medium)
                .foregroundColor(.secondary)
            
            Text(value)
                .font(.title2)
                .fontWeight(.bold)
                .foregroundColor(valueColor)
            
            if let subtitle = subtitle {
                Text(subtitle)
                    .font(.caption)
                    .foregroundColor(.secondary)
            }
            Spacer()
        }
        .frame(maxWidth: .infinity, maxHeight: 50, alignment: .leading )
        .padding(16)
        .background(.card)
        .cornerRadius(12)
        .shadow(color: Color.black.opacity(0.05), radius: 4, x: 0, y: 2)
    }
}
